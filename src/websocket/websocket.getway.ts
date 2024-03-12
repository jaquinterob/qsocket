import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

interface Vote {
  user: string;
  vote: number | string;
  hash: string;
}

@WebSocketGateway({ cors: true })
export class websocketGetway {
  @WebSocketServer()
  server: Server;
  private votes: Vote[] = [];

  @SubscribeMessage('vote')
  newMessage(@ConnectedSocket() client: Socket, @MessageBody() newVote: Vote) {
    if (this._userExistsSameHash(newVote)) {
      const voteSelected = this.votes.filter(
        (vote) => vote.user === newVote.user && vote.hash === newVote.hash,
      )[0];
      voteSelected.vote = newVote.vote;
      client.broadcast.emit('votes', this.votes);
    } else {
      console.log(
        'el voto no se pudo registrar porque no coincide con el hash',
      );
    }
  }

  @SubscribeMessage('newUser')
  newUser(@MessageBody() newVote: Vote): boolean {
    if (this._userExistsSameHash(newVote)) {
      console.log('el user ya existía y estaba autenticado.');
      return true;
    } else {
      if (this._userExistsOtherHash(newVote)) {
        console.log('El user ya está en uso');
        return false;
      } else {
        console.log('El user se creó');
        this._pushNewVote(newVote);
        return true;
      }
    }
  }

  private _userExistsOtherHash(newVote: Vote): boolean {
    return this.votes.some(
      (vote) => vote.user === newVote.user && vote.hash !== newVote.hash,
    );
  }

  private _userExistsSameHash(newVote: Vote): boolean {
    return this.votes.some(
      (vote) => vote.user === newVote.user && vote.hash === newVote.hash,
    );
  }

  private _pushNewVote(newVote: Vote): void {
    this.votes.push(newVote);
    this._emitVotes(newVote);
  }

  private _emitVotes(newVote: Vote): void {
    this.server.emit('votes', this.votes);
  }

  @SubscribeMessage('currentVotes')
  getVotes() {
    return this.votes;
  }

  @SubscribeMessage('resetVotes')
  resetVotes() {
    this.votes.forEach((vote) => (vote.vote = ''));
    this.server.emit('votes', this.votes);
  }
}
