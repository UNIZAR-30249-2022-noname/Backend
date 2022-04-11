import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1649697620304 implements MigrationInterface {
    name = 'migrate1649697620304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserve" ("id" SERIAL NOT NULL, "fecha" character varying NOT NULL, "horainicio" character varying NOT NULL, "horafin" character varying NOT NULL, "persona" character varying NOT NULL, "espacioid" character varying(50) NOT NULL, CONSTRAINT "PK_619d1e12dbedbe126620cac8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "space" ("id" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "capacity" integer NOT NULL, "building" character varying(25) NOT NULL, "floor" character varying(25) NOT NULL, "kind" character varying(50) NOT NULL, CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD CONSTRAINT "FK_69e7310ac700041e55a90da46c1" FOREIGN KEY ("espacioid") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserve" DROP CONSTRAINT "FK_69e7310ac700041e55a90da46c1"`);
        await queryRunner.query(`DROP TABLE "space"`);
        await queryRunner.query(`DROP TABLE "reserve"`);
    }

}
