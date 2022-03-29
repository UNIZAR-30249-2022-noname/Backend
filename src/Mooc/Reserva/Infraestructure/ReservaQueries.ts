export enum ReservaQueries {
  QUERY_BUSCAR_RESERVA_POR_ID = 'SELECT * FROM reservas WHERE id=$1',
  QUERY_BUSCAR_RESERVAS_POR_PERSONA = 'SELECT * FROM reservas WHERE person=$1',
  QUERY_BUSCAR_TODAS_RESERVAS = 'SELECT * FROM reservas',
  QUERY_INTRODUCIR_RESERVA = 'INSERT INTO reservas (space,hourstart,hourend,date,person) VALUES ($1,$2,$3,$4,$5)',
  QUERY_ACTUALIZAR_RESERVA = 'UPDATE reservas SET hourstart=$1,hourend=$2,date=$3 WHERE id=$4',
  QUERY_ELIMINAR_RESERVA = 'DELETE FROM reservas WHERE id=$1',
}
