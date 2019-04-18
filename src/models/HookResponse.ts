import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Hook } from "./Hook";

@Entity({ name: "hook_response" })
export class HookResponse extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "json" })
	headers: object;

	@Column({ type: "json" })
	body: object | string;

	@Column({ type: "int", default: 200 })
	status: number;

	@OneToOne(type => Hook, hook => hook.hookResponse)
	@JoinColumn({ name: "hook_id" })
	hook: Hook;

	@CreateDateColumn()
	dateCreated: Date;
}
