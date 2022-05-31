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

export const actualizarHorarioInput: any = {
  body: {
    DegreeSet: {
      Degree: "Graduado en Ingeniería Informática",
      Year: 1,
      Group: "1"
    },
    Entry: [
      {
        Init: { hour: 8, min: 0 },
        End: { hour: 9, min: 0 },
        Subject: { Kind: 1, Name: "Programación 1" },
        Room: { Name: "CRE.1200.00.040" },
        Week: "",
        Weekday: 0
      },

      {
        Init: { hour: 9, min: 0 },
        End: { hour: 10, min: 0 },
        Subject: { Kind: 2, Name: "Arquitectura y organización de computadores 1" },
        Room: { Name: "CRE.1200.00.040" },
        Week: "A",
        Weekday: 0
      },

      {
        Init: { hour: 10, min: 0 },
        End: { hour: 11, min: 0 },
        Subject: { Kind: 3, Name: "Física y electrónica" },
        Room: { Name: "CRE.1200.00.040" },
        Week: "",
        Weekday: 0
      },

      {
        Init: { hour: 11, min: 0 },
        End: { hour: 13, min: 30 },
        Subject: { Kind: 1, Name: "Programación 1" },
        Room: { Name: "CRE.1200.00.040" },
        Week: "",
        Weekday: 0
      }
    ]
  }
}

export const ResultadoTestObtenerReservasUsuario = [
{
      "space": "LABORATORIO C4 0 26 ",
      "day": "13-05-1300",
      "event": "Evento de reserva",
      "scheduled": [
          {
              "hour": 9,
              "min": 60
          },
          {
              "hour": 10,
              "min": 0
          }
      ],
      "owner": "UsuarioTestReservas12345",
      "key": (Math.random() * 10).toString()
}
]
