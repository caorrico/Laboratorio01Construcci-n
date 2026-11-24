import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity("persona")
export class Persona {
  @PrimaryGeneratedColumn("uuid") id_persona: string;
  @Column({ length: 100 }) nombres: string;
  @Column({ length: 100 }) apellidos: string;
  @Column({ length: 20, unique: true }) identificacion: string;
  @Column({ length: 150 }) correo: string;
  @Column({ type: "varchar", length: 20, nullable: true }) telefono:
    string | null;
  @Column({ default: true }) estado: boolean;
}
