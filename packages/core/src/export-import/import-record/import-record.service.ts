import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TenantAwareCrudService } from "./../../core/crud";
import { ImportRecord } from "./../../core/entities/internal";


@Injectable()
export class ImportRecordService extends TenantAwareCrudService<ImportRecord> {

	constructor(
		@InjectRepository(ImportRecord)
		private readonly importRecordRepository: Repository<ImportRecord>,
		@MikroInjectRepository(ImportRecord)
		private readonly mikroImportRecordRepository: EntityRepository<ImportRecord>,
	) {
		super(importRecordRepository, mikroImportRecordRepository);
	}
}
