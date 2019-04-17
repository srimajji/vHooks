import { BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Entity, BeforeInsert, Index } from "typeorm";
import * as random from "casual";
import { HookRequest } from "./HookRequest";

@Entity({ name: "hook" })
export class Hook extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 80, unique: true })
	@Index("idx_permalink")
	permalink: string;

	@OneToMany(type => HookRequest, hookRequest => hookRequest.hook)
	hookRequests: HookRequest[];

	@BeforeInsert()
	checkForPermalink() {
		if (!this.permalink) {
			this.permalink = random.array_of_words(4).join("-");
		} else {
			this.permalink = this.permalink.split(" ").join("-");
		}
	}
}
