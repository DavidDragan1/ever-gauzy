import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
	IEmployeePresetInput,
	IGetJobPresetCriterionInput,
	IGetJobPresetInput,
	IGetMatchingCriterions,
	IJobPreset,
	IMatchingCriterions
} from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { RequestContext } from './../core/context';
import { JobPresetUpworkJobSearchCriterion } from './job-preset-upwork-job-search-criterion.entity';
import { EmployeeUpworkJobsSearchCriterion } from './employee-upwork-jobs-search-criterion.entity';
import { JobPreset } from './job-preset.entity';
import { Employee } from '../employee/employee.entity';
import {
	CreateJobPresetCommand,
	SaveEmployeeCriterionCommand,
	SaveEmployeePresetCommand,
	SavePresetCriterionCommand
} from './commands';
import { isNotEmpty } from 'class-validator';
import { prepareSQLQuery as p } from '@gauzy/config';

@Injectable()
export class JobPresetService extends TenantAwareCrudService<JobPreset> {
	constructor(
		private readonly commandBus: CommandBus,

		@InjectRepository(JobPreset)
		private readonly jobPresetRepository: Repository<JobPreset>,

		@MikroInjectRepository(JobPreset)
		private readonly mikroJobPresetRepository: EntityRepository<JobPreset>,

		@InjectRepository(JobPresetUpworkJobSearchCriterion)
		private readonly jobPresetUpworkJobSearchCriterionRepository: Repository<JobPresetUpworkJobSearchCriterion>,

		@MikroInjectRepository(JobPresetUpworkJobSearchCriterion)
		private readonly mikroJobPresetUpworkJobSearchCriterionRepository: EntityRepository<JobPresetUpworkJobSearchCriterion>,

		@InjectRepository(EmployeeUpworkJobsSearchCriterion)
		private readonly employeeUpworkJobsSearchCriterionRepository: Repository<EmployeeUpworkJobsSearchCriterion>,

		@MikroInjectRepository(EmployeeUpworkJobsSearchCriterion)
		private readonly mikroEmployeeUpworkJobsSearchCriterionRepository: EntityRepository<EmployeeUpworkJobsSearchCriterion>,

		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,

		@MikroInjectRepository(Employee)
		private readonly mikroEmployeeRepository: EntityRepository<Employee>
	) {
		super(jobPresetRepository, mikroJobPresetRepository);
	}

	public async getAll(request?: IGetJobPresetInput) {
		const tenantId = RequestContext.currentTenantId() || request.tenantId;
		const { organizationId, search, employeeId } = request;

		const query = this.jobPresetRepository.createQueryBuilder('job_preset');
		query.setFindOptions({
			join: {
				alias: 'job_preset',
				leftJoin: {
					employees: 'job_preset.employees'
				}
			},
			relations: {
				jobPresetCriterions: true
			},
			order: {
				name: 'ASC'
			},
		});
		query.where((qb: SelectQueryBuilder<JobPreset>) => {
			qb.andWhere(p(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });

			if (isNotEmpty(organizationId)) {
				qb.andWhere(p(`"${qb.alias}"."organizationId" = :organizationId`), {
					organizationId
				});
			}
			if (isNotEmpty(search)) {
				qb.andWhere(p(`"${query.alias}"."name" ILIKE :search`), {
					search: `%${search}%`
				});
			}
			if (isNotEmpty(employeeId)) {
				qb.andWhere(p(`"employees"."id" = :employeeId`), {
					employeeId
				});
			}
		});
		return await query.getMany();
	}

	public async get(id: string, request?: IGetJobPresetCriterionInput) {
		const query = this.jobPresetRepository.createQueryBuilder();
		query.leftJoinAndSelect(
			`${query.alias}.jobPresetCriterions`,
			'jobPresetCriterions'
		);
		if (request.employeeId) {
			query.leftJoinAndSelect(
				`${query.alias}.employeeCriterions`,
				'employeeCriterions',
				'employeeCriterions.employeeId = :employeeId',
				{ employeeId: request.employeeId }
			);
		}
		query.andWhere(`${query.alias}.id = :id`, { id });

		return query.getOne();
	}

	public getJobPresetCriterion(presetId: string) {
		return this.jobPresetUpworkJobSearchCriterionRepository.findBy({
			jobPresetId: presetId
		});
	}

	public getEmployeeCriterion(input: IGetMatchingCriterions) {
		return this.employeeUpworkJobsSearchCriterionRepository.findBy({
			...(input.jobPresetId ? { jobPresetId: input.jobPresetId } : {}),
			employeeId: input.employeeId
		});
	}

	public async createJobPreset(request?: IJobPreset) {
		return this.commandBus.execute(
			new CreateJobPresetCommand(request)
		);
	}

	async saveJobPresetCriterion(request: IMatchingCriterions) {
		return this.commandBus.execute(
			new SavePresetCriterionCommand(request)
		);
	}

	async saveEmployeeCriterion(request: IMatchingCriterions) {
		return this.commandBus.execute(
			new SaveEmployeeCriterionCommand(request)
		);
	}

	async getEmployeePreset(employeeId: string) {
		const employee = await this.employeeRepository.findOne({
			where: {
				id: employeeId
			},
			relations: {
				jobPresets: true
			}
		});
		return employee.jobPresets;
	}

	async saveEmployeePreset(request: IEmployeePresetInput) {
		return this.commandBus.execute(new SaveEmployeePresetCommand(request));
	}

	deleteEmployeeCriterion(creationId: string, employeeId: string) {
		return this.employeeUpworkJobsSearchCriterionRepository.delete({
			id: creationId,
			employeeId: employeeId
		});
	}

	deleteJobPresetCriterion(creationId: string) {
		return this.jobPresetUpworkJobSearchCriterionRepository.delete(
			creationId
		);
	}
}
