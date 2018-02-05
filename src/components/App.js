import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Calendar from './Calendar';
import '../css/bigCalendar'
import '../css/App'
import { loadData, filterByType, update, onNav, goToAppointment } from '../reducers/appointments'

class App extends Component {
  constructor() {
    super()
    this.state = {
      type: 'normal',
    }
  }

  handleLoadata = () => {
    this.props.loadData();
  }

  handleFilterType = e => {
    const type = e.target.value || this.state.type;
    this.props.filterByType(type);
  }

  render() {
    const {loaded, loading } = this.props;

    const getEndDate = start => {
      const hour = 3600000;
      const a = new Date(start).getTime();
      return new Date(a + hour);
    }
    
    const getEvents = () => {
      return this.props.filteredAppointments.map(e => {
        return {
          id: e._id,
          title: `${e.name} ${e.type}`,
          start: new Date(e.date),
          end: getEndDate(e.date),
        }
      });
    };

    const hasAppointments = this.props.filteredAppointments && this.props.filteredAppointments.length;
    const noAppointments = (this.props.type && !hasAppointments) ? <span>&nbsp;No appointments available for type: {this.props.type}</span> : null;
    const cal = <div className="calendar_wrapper"><Calendar events={getEvents()} onNav={this.props.onNav} selectedDate={this.props.date} /></div>;
    const noAppointmentsInWeek = !this.props.inWeek && hasAppointments ? (
      <div>
        no appointment these week&nbsp;
        {this.props.next &&
          <div>next available appointment - {this.props.next.name} {this.props.next.date}</div>}
          <button onClick={() => this.props.goToAppointment(this.props.next.date)}>
            go to next appointment
          </button>
        </div>) : null;

    return (
      <div>
        <div className='app'>
          <div>
            <button onClick={() => this.handleLoadata()}>
              Load data&nbsp;
              {!loaded &&
              <small><span>
                click to load some data to start... {loading && <span>loading ...</span>}
              </span></small>}
            </button>
          </div>
          
          {loaded && <div>
            <select defaultValue={null} onChange={e => this.handleFilterType(e)}>
              <option>Please select a type</option>
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="trivial">Trivial</option>
              <option value="none">None</option>
            </select> 
            {this.props.type && <span>&nbsp;Selected type: {this.props.type}</span>}
          </div>}
          {noAppointmentsInWeek}
          {noAppointments}
          {cal}
        </div>
      </div>
    )
  }
}

const mapDispatch = { loadData, filterByType, update, onNav, goToAppointment };
const mapState = ({ appointments }) => ({
  type: appointments.type,
  date: appointments.date,
  next: appointments.next,
  inWeek: appointments.inWeek,
  loaded: appointments.loaded,
  loading: appointments.loading,
  appointments: appointments.data,
  filteredAppointments: appointments.filteredData,
})

export default connect(mapState, mapDispatch)(App)
