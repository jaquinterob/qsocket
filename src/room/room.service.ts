import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { RoomDto, UpdateRoomDto } from './dto/room.dto';
import { Vote } from 'src/websocket/interfaces/vote';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async findAll() {
    return await this.roomModel
      .find()
      .sort({ createdAt: -1 })
      .catch((error) => {
        throw error;
      });
  }

  async create(roomDto: RoomDto): Promise<RoomDto> {
    const newRoom = await this.roomModel.create(roomDto).catch((error) => {
      throw error;
    });
    return await newRoom.save().catch((error) => {
      throw error;
    });
  }

  async update(hash: string, roomDto: UpdateRoomDto): Promise<RoomDto> {
    const existingRoom = await this.roomModel
      .findOne({ hash })
      .catch((error) => {
        throw error;
      });
    if (existingRoom) {
      return this.roomModel
        .findOneAndUpdate({ hash }, roomDto, {
          new: true,
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  async addUserToRoom(newUser: string, hash: string): Promise<RoomDto> {
    try {
      const existingRoom = await this.roomModel.findOne({ hash });
      if (existingRoom) {
        const existUser = this.existUser(newUser, existingRoom.users);
        if (!existUser) {
          existingRoom.users.push(newUser);
        }
        return existingRoom.save().catch((error) => {
          throw error;
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async setLastVotes(votes: Vote[], hash: string): Promise<RoomDto> {
    try {
      const existingRoom = await this.roomModel.findOne({ hash });
      if (existingRoom) {
        existingRoom.lastVotes = votes.sort((a, b) => b.value - a.value);
        return await existingRoom.save().catch((error) => {
          throw error;
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async setShowBy(user: string, hash: string): Promise<RoomDto> {
    try {
      const existingRoom = await this.roomModel.findOne({ hash });
      if (existingRoom) {
        existingRoom.showBy = user;
        return await existingRoom.save().catch((error) => {
          throw error;
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private existUser(newUser: string, users: string[]): boolean {
    return users.some(
      (user) =>
        user.trim().toLocaleLowerCase() === newUser.trim().toLocaleLowerCase(),
    );
  }
}
