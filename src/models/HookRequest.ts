import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from "typeorm";
import { Hook } from "./Hook";
import { HookResponse } from "./HookResponse";

@Entity({ name: "hook_request" })
export class HookRequest extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 128 })
	host: string;

	@Column({ type: "varchar", length: 128 })
	ip: string;

	@Column({ type: "varchar", length: 10 })
	httpVersion: string;

	@Column({ type: "varchar", length: 10 })
	method: string;

	@Column({ name: "request_id", type: "uuid" })
	requestId: string;

	@Column({ type: "json" })
	headers: object;

	@Column({ type: "json" })
	query: object;

	@Column({ type: "json" })
	body: object;

	@OneToOne(type => HookResponse, hookResponse => hookResponse.hookRequest, { cascade: true })
	@JoinColumn({ name: "hook_response_id" })
	hookResponse: HookResponse;

	@ManyToOne(type => Hook, hook => hook.hookRequests)
	@JoinColumn({ name: "hook_id" })
	hook: Hook;

	@CreateDateColumn({ name: "date_created" })
	dateCreated: Date;
}
