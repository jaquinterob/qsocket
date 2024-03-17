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
import { Room } from 'src/websocket/interfaces/room';
import { Vote } from 'src/websocket/interfaces/vote';

@WebSocketGateway({ cors: true })
export class websocketGetway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private rooms: Room[] = [];

  handleConnection(@ConnectedSocket() client: Socket) {
    const roomName = client.handshake.query.room || 'default';
    if (
      !this.rooms.some(
        (room) => room.name.toLowerCase() === roomName.toString().toLowerCase(),
      )
    ) {
      this.rooms.push({ name: roomName as string, history: [], show: false });
    }
    client.join(roomName);
    const room = this.getRoom(roomName as string);
    client.emit('roomHistory', room.history);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.rooms.forEach((room) => {
      client.leave(room);
    });
  }

  @SubscribeMessage('existsUser')
  registerUser(@MessageBody() payload: any): boolean {
    const newVote = payload[0];
    const roomName = payload[1];
    const room = this.getRoom(roomName);
    return this.existsUser(newVote, room.history);
  }

  @SubscribeMessage('newVote')
  handleMessage(@MessageBody() payload: any): void {
    const newVote = payload[0];
    const roomName = payload[1];
    if (newVote.user === '') return;
    const room = this.getRoom(roomName);
    if (this.existsUser(newVote, room.history)) {
      this.updateVote(room, newVote);
    } else {
      room.history.push(newVote);
      this.server.to(roomName).emit('votes', newVote);
    }
  }

  @SubscribeMessage('logOut')
  logOut(@MessageBody() payload: any): void {
    const user = payload[0];
    const roomName = payload[1];
    const room = this.getRoom(roomName);
    room.history = room.history.filter((vote) => vote.user !== user);
    this.server.to(roomName).emit('votes', room.history);
  }

  @SubscribeMessage('setShow')
  showVotes(@MessageBody() payload: any): void {
    const roomName = payload[0];
    const show = payload[1];
    const room = this.getRoom(roomName);
    room.show = show;
    this.server.to(roomName).emit('show', room.show);
  }

  @SubscribeMessage('resetVotes')
  resetVotes(@MessageBody() roomName: string): void {
    const room = this.getRoom(roomName);
    console.log(roomName);
    this.resetAllVotes(room);
  }

  private resetAllVotes(room: Room) {
    console.log(room.history);
    room.history.forEach((vote) => (vote.value = 0));
    console.log(room.history);
    this.server.to(room.name).emit('roomHistory', room.history);
  }

  private updateVote(room: Room, newVote: Vote): void {
    const voteToUpdate = room.history.find(
      (vote) => vote.user.toLowerCase() === newVote.user.toLowerCase(),
    );
    voteToUpdate.value = newVote.value;
    this.server.to(room.name).emit('roomHistory', room.history);
  }

  private addUser(room: Room, newVote: Vote): void {
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
}
