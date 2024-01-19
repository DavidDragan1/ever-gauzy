import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { EmployeeAward } from './employee-award.entity';

@Injectable()
export class EmployeeAwardService extends TenantAwareCrudService<EmployeeAward> {
	constructor(
		@InjectRepository(EmployeeAward)
		private readonly employeeAwardRepository: Repository<EmployeeAward>,
		@MikroInjectRepository(EmployeeAward)
		private readonly mikroEmployeeAwardRepository: EntityRepository<EmployeeAward>
	) {
		super(employeeAwardRepository, mikroEmployeeAwardRepository);
	}
}
