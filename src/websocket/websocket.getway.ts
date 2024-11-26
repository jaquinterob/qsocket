import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Room } from '../websocket/interfaces/room';
import { Vote } from 'src/websocket/interfaces/vote';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class WebsocketGetway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private rooms: Room[] = [];

  handleConnection(@ConnectedSocket() client: Socket) {
    const roomName = client.handshake.query.room || 'default';
    const existingRoom = this.rooms.some(
      (room) => room.name.toLowerCase() === roomName.toString().toLowerCase(),
    );
    if (!existingRoom) {
      this.rooms.push({
        name: roomName as string,
        history: [],
        show: false,
        showBy: '',
      });
    }
    client.join(roomName);
    const room = this.getRoom(roomName as string);
    client.emit('roomHistory', room.history);
    client.emit('show', room.show);
    client.emit('showBy', room.showBy);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.rooms.forEach((room) => {
      client.leave(room);
    });
  }

  @SubscribeMessage('existsUser')
  registerUser(@MessageBody() payload: any[]): boolean {
    const newVote: Vote = payload[0];
    const roomName: string = payload[1];
    const room = this.getRoom(roomName);
    return this.existsUser(newVote, room.history);
  }

  @SubscribeMessage('newVote')
  handleMessage(@MessageBody() payload: any[]): void {
    const newVote: Vote = payload[0];
    const roomName: string = payload[1];
    if (newVote.user === '') return;
    const room = this.getRoom(roomName);
    this.server.to(roomName).emit('showBy', room.showBy);
    if (this.existsUser(newVote, room.history)) {
      this.updateVote(room, newVote);
    } else {
      this.addNewVote(room, newVote);
    }
  }

  @SubscribeMessage('logOut')
  logOut(@MessageBody() payload: any): void {
    const user = payload[0];
    const roomName = payload[1];
    const room = this.getRoom(roomName);
    room.history = room.history.filter((vote) => vote.user !== user);
    this.server.to(roomName).emit('roomHistory', room.history);
  }

  @SubscribeMessage('setShow')
  async showVotes(@MessageBody() payload: any): Promise<void> {
    const roomName = payload[0];
    const show = payload[1];
    const user = payload[2];
    const room = this.getRoom(roomName);
    room.show = show;
    if (room.show) {
      this.server.to(roomName).emit('showBy', user);
    }
    this.server.to(roomName).emit('show', room.show);
    this.server.to(roomName).emit(
      'roomHistory',
      room.history.sort((a, b) => b.value - a.value),
    );
  }

  @SubscribeMessage('resetVotes')
  resetVotes(@MessageBody() roomName: string): void {
    const room = this.getRoom(roomName);
    this.resetAllVotes(room);
  }

  @SubscribeMessage('resetValue')
  resetValue(@MessageBody() roomName: string): void {
    this.server.to(roomName).emit('value');
  }

  private resetAllVotes(room: Room) {
    room.history.forEach((vote) => (vote.value = 0));
    this.server.to(room.name).emit('roomHistory', room.history);
  }

  private updateVote(room: Room, newVote: Vote): void {
    const voteToUpdate = room.history.find(
      (vote) => vote.user.toLowerCase() === newVote.user.toLowerCase(),
    );
    voteToUpdate.value = newVote.value;
    room.show
      ? this.server.to(room.name).emit(
          'roomHistory',
          room.history.sort((a, b) => b.value - a.value),
        )
      : this.server.to(room.name).emit('roomHistory', room.history);

    this.generateIaComment(room.history).then((comment) =>
      this.server.to(room.name).emit('iaMessage', comment),
    );
  }

  private addNewVote(room: Room, newVote: Vote): void {
    room.history.push(newVote);
    this.server.to(room.name).emit('votes', newVote);
  }

  private existsUser(newVote: Vote, roomHistory: Vote[]): boolean {
    return roomHistory.some(
      (vote) => vote.user.toLowerCase() === newVote.user.toLowerCase(),
    );
  }

  private getRoom(roomName: string): Room {
    return this.rooms.find((room) => room.name === roomName);
  }

  constructor(private configService: ConfigService) {}

  async generateIaComment(votes: Vote[]): Promise<string> {
    const message = `esto es el resultado de las votaciones en un poker de metodologia agil, esto sirve para estimar la complejiidad de una tarea, porfavor hazme un comentario divertido usando emojis, que el texto generado sea sin saltos de linea ni caracteres especiales, solo emojis pero pocos y texto plano: ${JSON.stringify(votes)}, quiero que no hables de cerveza y si te refieres a John o JohnQ porfavor no le pidas que tome café, al final sugiere un puntaje de complejidad para la tarea, las posibilidades son 0.5,1,2,3,5,8,13 haz la sugerencias de preguntas, si los votos con iguales no hagas preguntas y afirma la complejidad que todos los votantes seleccionaron. datos adicionales si eligen -2 significa el votante tienen incertidumbre, -1 el votante necesita un break, 0 significa que votante no ha votado y 100 significa que el votante piensa que es muy compleja la tarea. incluye emojis de navidad si es que estamos en diciembre`;

    const GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Hubo un problema con la petición.');
    }

    const responseData = await response.json();

    return responseData.candidates[0].content.parts[0].text
      ?.replace(/\n/g, ' ')
      .replace(/\[object Object\]/g, '');
  }
}
