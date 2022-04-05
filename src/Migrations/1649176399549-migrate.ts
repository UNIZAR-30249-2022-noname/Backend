import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1649176399549 implements MigrationInterface {
    name = 'migrate1649176399549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "space" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "Capacity" integer NOT NULL, "Building" character varying(25) NOT NULL, "Kind" character varying(50) NOT NULL, CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reserve" ("id" SERIAL NOT NULL, "fecha" character varying NOT NULL, "horaInicio" character varying NOT NULL, "horaFin" character varying NOT NULL, "persona" character varying NOT NULL, "espacioId" integer, CONSTRAINT "PK_619d1e12dbedbe126620cac8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reserve" DROP COLUMN "espacioId"`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD "espacioId" integer`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4" FOREIGN KEY ("espacioId") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserve" DROP CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4"`);
        await queryRunner.query(`ALTER TABLE "reserve" DROP COLUMN "espacioId"`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD "espacioId" integer`);
        await queryRunner.query(`DROP TABLE "reserve"`);
        await queryRunner.query(`DROP TABLE "space"`);
    }

}
