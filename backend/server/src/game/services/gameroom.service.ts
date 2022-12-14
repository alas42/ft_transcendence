import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { GameRoomClass, GAMEROOMSTATUS } from '../classes/gameroom.class';
import { CreateGameDto } from '../dto/create-game.dto';
import GameRoomInterface from '../interfaces/gameroom.interface';

@Injectable()
export class GameRoomService {

	public rooms: string[] = [];
	private readonly ppr: number = 2;
	public gameRooms: Map<string, GameRoomClass> = new Map<string, GameRoomClass>();

	generate_name(): string {
		var name: string = uuid();
		return (name);
	}

	addRoom(createGameDto: CreateGameDto): string {
		const roomname: string = this.generate_name();
		this.rooms.push(roomname);
		let newGameRoom: GameRoomClass = new GameRoomClass();
		newGameRoom.setOptions(roomname, createGameDto);
		this.gameRooms.set(roomname, newGameRoom);
		return roomname;
	}

	getRooms(): string[] {
		return this.rooms;
	}

	getRoomsNotFull(): string[] {
		let rooms: string[] = [];
		for (const [keyroom, gameroom] of this.gameRooms) {
			if (gameroom.status === GAMEROOMSTATUS.WAITING)
				rooms.push(keyroom);
		}
		return rooms;
	}

	getRoomNameByPlayerId(idPlayer: string): string {
		for (const [keyroom, gameroom] of this.gameRooms) {
			if (gameroom.getPlayerById(idPlayer))
				return keyroom;
		}
		return null;
	}

	getRoomById(id_room: string): GameRoomClass {
		return this.gameRooms.get(id_room);
	}

	getPlayersInRooms(): GameRoomInterface[] {
		let ppr: { roomname: string, player1: string, avatar1: string, player2: string, avatar2: string }[] = [];
		for (const [keyroom, gameroom] of this.gameRooms) {
			let players: string[] = gameroom.getPlayers();
			let avatars: string[] = gameroom.getPlayersAvatars();
			if (players.length !== 0) {
				var gri: GameRoomInterface = {
					roomname: keyroom,
					player1: players[0],
					avatar1: avatars[0],
					player2: players[1],
					avatar2: avatars[1],
				};
				ppr.push(gri);
			}
		}
		return ppr;
	}

	containsRoom(room_id: string): boolean {
		if (this.rooms.indexOf(room_id) === -1)
			return false;
		return true;
	}

	removePlayerFromRooms(sid: string): void {
		for (const [keyroom, gameroom] of this.gameRooms) {
			gameroom.removePlayerFromRoom(sid);
		}
	}

	clear(): void {
		this.rooms = [];
		this.gameRooms.clear();
	}

	deleteRoom(roomid: string): void {
		if (this.rooms.indexOf(roomid) === -1)
			return;
		this.rooms = this.rooms.splice(this.rooms.indexOf(roomid), 1);
		this.gameRooms.get(roomid).clearPlayers();
		this.gameRooms.delete(roomid);
	}

	getPPG(): number {
		return this.ppr;
	}

	findRoom(user: User): string {
		const rooms: string[] = this.getRoomsNotFull();
		if (rooms.length === 0) {
			return this.addRoom({ difficulty: "Medium", points: 5, map: "Pong" });
		}
		else if (rooms.length === 1) {
			return rooms[0];
		} else {
			const players_mmr: number[] = [];
			const players_id: string[] = [];
			for (var i: number = 0; i < rooms.length; i++) {
				var gameRoom: GameRoomClass = this.getRoomById(rooms[i]);
				players_id.push(gameRoom.getPlayersId()[0]);
				players_mmr.push(gameRoom.getPlayerById(players_id[i]).mmr);
			}
			const current_mmr: number = user.player.mmr;
			var x: number = Number.MAX_SAFE_INTEGER;
			var index_closest: number = -1;
			for (var i: number = 0; i < players_mmr.length; i++) {
				let diff: number = players_mmr[i] - current_mmr;
				diff = (diff < 0) ? diff * -1 : diff;
				if (diff <= x) {
					x = diff;
					index_closest = i;
				}
			}
			return (this.getRoomNameByPlayerId(players_id[index_closest]));
		}
	}
}
