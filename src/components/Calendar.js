import React from 'react'
import BigCalendar from 'react-big-calendar'
import events from './events'

import moment from 'moment'
import 'moment/locale/en-gb';
moment.locale('en-GB');

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

let Calendar = props => {
  return (<BigCalendar
    events={props.events}
    defaultView="week"
    views={['week', 'month']}
    step={60}
    culture="en-GB"
    date={new Date(props.selectedDate)}
    onNavigate={date => {
      props.onNav(date);
    }}
    onView={date => {
    }}
  />);
};

export default Calendar