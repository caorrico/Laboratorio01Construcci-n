import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError } from "typeorm";
import { Persona } from "./entities/persona.entity";
import { CreatePersonaDto } from "./dto/create-persona.dto";
import { UpdatePersonaDto } from "./dto/update-persona.dto";
@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona) private readonly repository: Repository<Persona>,
  ) {}
  private databaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const code = (error.driverError as { code?: string }).code;
      if (code === "23505")
        throw new ConflictException("La identificación ya existe");
      if (code === "23503")
        throw new ConflictException("La persona está asociada a un usuario");
    }
    throw error;
  }
  async create(dto: CreatePersonaDto) {
    try {
      return await this.repository.save(this.repository.create(dto));
    } catch (error) {
      this.databaseError(error);
    }
  }
  findAll() {
    return this.repository.find();
  }
  async findOne(id: string) {
    const persona = await this.repository.findOneBy({ id_persona: id });
    if (!persona) throw new NotFoundException("Persona no encontrada");
    return persona;
  }
  async update(id: string, dto: UpdatePersonaDto) {
    const persona = await this.findOne(id);
    try {
      return await this.repository.save({ ...persona, ...dto });
    } catch (error) {
      this.databaseError(error);
    }
  }
  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.repository.delete(id);
      return { message: "Persona eliminada correctamente" };
    } catch (error) {
      this.databaseError(error);
    }
  }
}
