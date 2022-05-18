import { DatosReservaProps } from '../../src/Mooc/Reserva/Domain/Entities/datosreserva';

export const expectedOuputT3 = [
  {
    hour: 8,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 9,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 10,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 11,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 12,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 13,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 14,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 15,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 16,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 17,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 18,
    occupied: true,
    person: 'Usuario',
    event: 'Reservar aula',
  },
  {
    hour: 19,
    occupied: false,
    person: '',
    event: '',
  },
  {
    hour: 20,
    occupied: false,
    person: '',
    event: '',
  },
];

const DataEdificios = [
  {
    nombre: 'Ada Byron',
    plantas: [
      'Sótano',
      'Baja',
      'Primera',
      'Segunda',
      'Tercera',
      'Cuarta',
      'Quinta',
    ],
  },
  {
    nombre: 'Torres Quevedo',
    plantas: ['Sótano', 'Baja', 'Primera', 'Segunda', 'Tercera'],
  },
  {
    nombre: 'Betancourt',
    plantas: ['Sótano', 'Baja', 'Primera', 'Segunda', 'Tercera'],
  },
];

export const reservas: any[] = [
  {
    fecha: '12-05-2003',
    horaInicio: 10,
    horaFin: 11,
    Persona: 'Anonimo',
    evento: 'Reserva',
    id: 1,
  },
];
