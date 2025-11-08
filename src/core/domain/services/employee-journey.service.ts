import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import {
  CreateEmployeeJourneyDto,
  UpdateEmployeeJourneyDto,
  CreateJourneyTouchpointDto,
  UpdateJourneyTouchpointDto,
} from '@application/api/dto/employee-journey.dto';
import { EmployeeJourneyStatus, Prisma } from '@prisma/client';

@Injectable()
export class EmployeeJourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EmployeeJourneyModel[]> {
    const journeys = await this.prisma.employeeJourney.findMany({
      include: {
        department: true,
        position: true,
        touchpoints: {
          orderBy: { occurredAt: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return journeys.map((journey) => this.mapJourney(journey));
  }

  async findById(id: string): Promise<EmployeeJourneyModel> {
    const journey = await this.prisma.employeeJourney.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        touchpoints: {
          orderBy: { occurredAt: 'asc' },
        },
      },
    });

    if (!journey) {
      throw new NotFoundException(`Employee journey with ID ${id} not found`);
    }

    return this.mapJourney(journey);
  }

  async findByEmployee(employeeId: string): Promise<EmployeeJourneyModel[]> {
    const journeys = await this.prisma.employeeJourney.findMany({
      where: { employeeId },
      include: {
        department: true,
        position: true,
        touchpoints: {
          orderBy: { occurredAt: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return journeys.map((journey) => this.mapJourney(journey));
  }

  async create(data: CreateEmployeeJourneyDto): Promise<EmployeeJourneyModel> {
    const journey = await this.prisma.employeeJourney.create({
      data: {
        employeeId: data.employeeId,
        departmentId: data.departmentId,
        positionId: data.positionId,
        type: data.type,
        description: data.description,
        status: data.status,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapJourney(journey);
  }

  async update(id: string, data: UpdateEmployeeJourneyDto): Promise<EmployeeJourneyModel> {
    await this.ensureJourneyExists(id);

    const journey = await this.prisma.employeeJourney.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        departmentId: data.departmentId,
        positionId: data.positionId,
        type: data.type,
        description: data.description,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: this.defaultInclude,
    });

    return this.mapJourney(journey);
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureJourneyExists(id);
    await this.prisma.employeeJourney.delete({ where: { id } });
    return true;
  }

  async findAllTouchpoints(journeyId: string): Promise<JourneyTouchpointModel[]> {
    await this.ensureJourneyExists(journeyId);

    const touchpoints = await this.prisma.employeeJourneyTouchpoint.findMany({
      where: { journeyId },
      orderBy: { occurredAt: 'asc' },
    });

    return touchpoints.map((touchpoint) => this.mapTouchpoint(touchpoint));
  }

  async createTouchpoint(data: CreateJourneyTouchpointDto): Promise<JourneyTouchpointModel> {
    await this.ensureJourneyExists(data.journeyId);

    const touchpoint = await this.prisma.employeeJourneyTouchpoint.create({
      data: {
        journeyId: data.journeyId,
        title: data.title,
        description: data.description,
        occurredAt: new Date(data.occurredAt),
      },
    });

    return this.mapTouchpoint(touchpoint);
  }

  async updateTouchpoint(
    id: string,
    data: UpdateJourneyTouchpointDto,
  ): Promise<JourneyTouchpointModel> {
    const touchpoint = await this.prisma.employeeJourneyTouchpoint.update({
      where: { id },
      data: {
        journeyId: data.journeyId,
        title: data.title,
        description: data.description,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : undefined,
      },
    });

    return this.mapTouchpoint(touchpoint);
  }

  async removeTouchpoint(id: string): Promise<boolean> {
    await this.prisma.employeeJourneyTouchpoint.delete({ where: { id } });
    return true;
  }

  private async ensureJourneyExists(id: string): Promise<void> {
    const exists = await this.prisma.employeeJourney.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Employee journey with ID ${id} not found`);
    }
  }

  private mapJourney(journey: EmployeeJourneyRecord): EmployeeJourneyModel {
    return {
      id: journey.id,
      employeeId: journey.employeeId,
      departmentId: journey.departmentId ?? undefined,
      departmentName: journey.department?.name ?? undefined,
      positionId: journey.positionId ?? undefined,
      positionTitle: journey.position?.title ?? undefined,
      type: journey.type,
      description: journey.description ?? undefined,
      status: journey.status,
      startDate: journey.startDate,
      endDate: journey.endDate ?? undefined,
      touchpoints: journey.touchpoints
        .slice()
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())
        .map((touchpoint) => this.mapTouchpoint(touchpoint)),
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    };
  }

  private mapTouchpoint(touchpoint: EmployeeJourneyTouchpointRecord): JourneyTouchpointModel {
    return {
      id: touchpoint.id,
      journeyId: touchpoint.journeyId,
      title: touchpoint.title,
      description: touchpoint.description ?? undefined,
      occurredAt: touchpoint.occurredAt,
      createdAt: touchpoint.createdAt,
      updatedAt: touchpoint.updatedAt,
    };
  }

  private get defaultInclude() {
    return {
      department: true,
      position: true,
      touchpoints: {
        orderBy: { occurredAt: 'asc' },
      },
    } satisfies Prisma.EmployeeJourneyInclude;
  }
}

type EmployeeJourneyRecord = Prisma.EmployeeJourneyGetPayload<{
  include: {
    department: true;
    position: true;
    touchpoints: true;
  };
}>;

type EmployeeJourneyTouchpointRecord =
  Prisma.EmployeeJourneyTouchpointGetPayload<Prisma.EmployeeJourneyTouchpointDefaultArgs>;

export type EmployeeJourneyModel = {
  id: string;
  employeeId: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionTitle?: string;
  type: string;
  description?: string;
  status: EmployeeJourneyStatus;
  startDate: Date;
  endDate?: Date;
  touchpoints: JourneyTouchpointModel[];
  createdAt: Date;
  updatedAt: Date;
};

export type JourneyTouchpointModel = {
  id: string;
  journeyId: string;
  title: string;
  description?: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
