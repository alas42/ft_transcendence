import { Channel, User } from '../../../typeorm';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ban {
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'ban_id',
	})
	id: number;

	@ManyToOne(() => User)
	@JoinTable()
	user: User;

	@ManyToOne(() => Channel, { onDelete: 'CASCADE' })
	@JoinTable()
	channel: Channel;

	@CreateDateColumn()
	start: Date;

	@Column({ nullable: false })
	end: Date;

	@Column({ nullable: false })
	duration: number;
}
