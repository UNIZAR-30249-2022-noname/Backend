export enum ReservaQueries {
    QUERY_BUSCAR_RESERVA = "SELECT x,y,j FROM latablaquesea WHERE loquesea",
    QUERY_INTRODUCIR_RESERVA = "INSERT into latablaquesea VALUES ($1,$2)"
}