import {
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	Entity,
	BeforeInsert,
	Index,
	OneToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
} from "typeorm";
import * as random from "casual";
import { HookRequest } from "./HookRequest";
import { HookResponse } from "./HookResponse";

@Entity({ name: "hook" })
export class Hook extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 80, unique: true })
	@Index("idx_permalink")
	permalink: string;

	@Column({ name: "response_eval_code", type: "longtext", nullable: true })
	responseEvalCode: string;

	@OneToMany(type => HookRequest, hookRequest => hookRequest.hook)
	hookRequests: HookRequest[];

	@CreateDateColumn({ name: "date_created" })
	dateCreated: Date;

	@UpdateDateColumn({ name: "last_updated" })
	lastUpdate: Date;

	@BeforeInsert()
	checkForPermalink() {
		if (!this.permalink) {
			this.permalink = random.array_of_words(4).join("-");
		} else {
			this.permalink = this.permalink.split(" ").join("-");
		}
	}
}
