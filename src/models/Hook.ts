import { BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Entity, BeforeInsert, Index, OneToOne } from "typeorm";
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

	@OneToMany(type => HookRequest, hookRequest => hookRequest.hook)
	hookRequests: HookRequest[];

	@OneToOne(type => HookResponse, hookResponse => hookResponse.hook)
	hookResponse: HookResponse;

	@BeforeInsert()
	checkForPermalink() {
		if (!this.permalink) {
			this.permalink = random.array_of_words(4).join("-");
		} else {
			this.permalink = this.permalink.split(" ").join("-");
		}
	}
}
