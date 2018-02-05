import moment from 'moment'

const LOAD_DATA = 'apointments/LOAD_DATA'
const LOAD_DATA_SUCCESS = 'apointments/LOAD_DATA_SUCCESS'
const LOAD_DATA_FAIL = 'apointments/LOAD_DATA_FAIL'
const UPDATE = 'apointments/UPDATE'
const ON_NAV = 'apointments/ON_NAV'

const FILTER_DATA = 'apointments/FILTER_DATA'
const GO_TO_APPOINTMENT = 'apointments/GO_TO_APPOINTMENT'

const initialState = {
  loaded: false,
  loading: false,
  data: [],
  filteredData: [],
  error: null,
  inWeek: true,
  type: null,
  date: new Date(),
}

export default function apointments(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_DATA:
      return {
        ...state,
        loading: true
      }
    case LOAD_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        inWeek: hasWeekAppointment(state.filteredData),
        data: JSON.parse(action.result) // not sure why i need to parseJson
      }
    case LOAD_DATA_FAIL:
      return {
        ...state,
        data: {},
        error: action.error,
        loaded: false,
        loading: false
      }
    case FILTER_DATA:
      const data = state.data.filter((item) => item.type === action.payload);
      return {
        ...state,
        type: action.payload,
        inWeek: hasWeekAppointment(data),
        next: getNextAvailableAppointment(data),
        filteredData: data,
      }
    case UPDATE:
      return {
        ...state,
        next: getNextAvailableAppointment(state.filteredData),
        inWeek: hasWeekAppointment(state.filteredData),
      }
    case ON_NAV:
      return {
        ...state,
        date: action.payload,
        next: getNextAvailableAppointment(state.filteredData, action.payload),
        inWeek: hasWeekAppointment(state.filteredData, action.payload),
      }
    case GO_TO_APPOINTMENT:
      return {
        ...state,
        next: getNextAvailableAppointment(state.filteredData, action.payload),
        date: action.payload,
        inWeek: hasWeekAppointment(state.filteredData, action.payload),
      }
    default:
      return state
  }
}

const getNextAvailableAppointment = (appointments, date = new Date()) => {
  const calendarDate = new Date(date).getTime();
  var closest = Infinity;
  let hit;

  appointments.forEach(function(d) {
   var _date = new Date(d.date).getTime();
  
   if (_date >= calendarDate && _date < closest) {
      hit = d;
      closest = new Date(d.date).getTime();
   }
  });

  return hit;
}

const hasWeekAppointment = ( appointments, date = new Date()) => {
  const calendarDate = moment(date);
  const inWeek = appointments.filter(a => {
    const appointmentDate = moment(a.date);
    const isThisWeek = (appointmentDate.isoWeek() === calendarDate.isoWeek())
    return isThisWeek;
  });

  return inWeek.length;
}

export const goToAppointment = date  => {
  return {
    type: GO_TO_APPOINTMENT,
    payload: date
  }
}

export const filterByType = condition  => {
  return {
    type: FILTER_DATA,
    payload: condition
  }
}

export const update = () => {
  return {
    type: UPDATE,
  }
}
export const onNav = date => {
  return {
    type: ON_NAV,
    payload: date,
  }
}

export function loadData() {
  const path = '/api/appointments/'
  return {
    types: [LOAD_DATA, LOAD_DATA_SUCCESS, LOAD_DATA_FAIL],
    promise: client => client.get(path)
  }
}
