import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToOne,
	UpdateDateColumn,
} from "typeorm";
import { Hook } from "./Hook";
import { HookRequest } from "./HookRequest";

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

	@Column({ name: "response_eval_code", type: "longtext", nullable: true })
	responseEvalCode: string;

	@OneToOne(type => HookRequest, hookRequest => hookRequest.hookResponse)
	hookRequest: HookRequest;

	@CreateDateColumn({ name: "date_created" })
	dateCreated: Date;
}
