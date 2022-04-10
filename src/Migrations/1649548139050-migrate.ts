import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1649548139050 implements MigrationInterface {
    name = 'migrate1649548139050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "space" ADD "Floor" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reserve" DROP CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4"`);
        await queryRunner.query(`ALTER TABLE "space" DROP CONSTRAINT "PK_094f5ec727fe052956a11623640"`);
        await queryRunner.query(`ALTER TABLE "space" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "space" ADD "id" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "space" ADD CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "reserve" DROP COLUMN "espacioId"`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD "espacioId" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4" FOREIGN KEY ("espacioId") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserve" DROP CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4"`);
        await queryRunner.query(`ALTER TABLE "reserve" DROP COLUMN "espacioId"`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD "espacioId" integer`);
        await queryRunner.query(`ALTER TABLE "space" DROP CONSTRAINT "PK_094f5ec727fe052956a11623640"`);
        await queryRunner.query(`ALTER TABLE "space" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "space" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "space" ADD CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "reserve" ADD CONSTRAINT "FK_e5f2803528a8a72e646b1db5db4" FOREIGN KEY ("espacioId") REFERENCES "space"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "space" DROP COLUMN "Floor"`);
    }

}
