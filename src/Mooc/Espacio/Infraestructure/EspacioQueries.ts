export enum EspacioQueries {
  QUERY_BUSCAR_ESPACIO_POR_ID = 'SELECT * FROM espacios WHERE id=$1',
  QUERY_INTRODUCIR_ESPACIO = 'INSERT INTO espacios (id,name,capacity,building,kind) VALUES ($1,$2,$3,$4,$5)',
  QUERY_OBTENER_ESPACIOS = 'SELECT * FROM espacios',
  QUERY_FILTRAR_ESPACIOS_POR_EDIFICIO_CAPACIDAD = 'SELECT * FROM espacios WHERE capacity=$1 AND building=$2',
}
