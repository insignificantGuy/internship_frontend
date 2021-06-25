import React from 'react';
import './schedule-date.styles.scss';
import back from '../../assets/images/back.png';
import next from '../../assets/images/next.png';
import ScheduleDiv from '../schedule-divs/schedule-div.component.jsx';

class ScheduleDate extends React.Component{
	constructor(){
		super();
		this.state = {
			schedule:[],
			date:0,
			month:0,
			year:0,
			nextMonth:0,
			nextYear:0,
			text:"",
		}
		this.prevDay = this.prevDay.bind(this);
		this.nextDay = this.nextDay.bind(this);
		this.getWeek = this.getWeek.bind(this);
		this.getMonth = this.getMonth.bind(this);
	}

	componentDidMount = async () => {
		var today = new Date();
		this.setState({
			date:today.getDate(),
			month:today.getMonth()+1,
			year:today.getFullYear(),
			nextMonth:0,
			nextWeek:0,
			nextYear:0,
			text: this.state.date+'/'+this.state.month+'/'+this.state.year,
			getWeekSchedule:false,
			getMonthShedule:false,
		},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year});
		})
		
	}

	nextDay(){
		if(this.state.date===30 || this.state.date===31){
			this.setState({date:1, month:this.state.month-1},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year});
			});
		}
		else{
			this.setState({date:this.state.date+1},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year});
			});
		}		
	}

	prevDay(){
		if(this.state.date===1){
			this.setState({date:31, month:this.state.month-1},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year});
			});
		}
		else{
			this.setState({date:this.state.date-1},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year});
			});
		}
	}

	getWeek = async() =>{
		if(this.state.date+7>30){
			this.setState({nextWeek:this.state.date+7-30,nextMonth:this.state.month+1,nextYear:this.state.year,getWeekSchedule:true},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year+'-'+this.state.nextWeek+'/'+this.state.month+'/'+this.state.year});
			});
		}
		else{
			this.setState({nextWeek:this.state.date+7,nextYear:this.state.year,getWeekSchedule:true},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year+'-'+this.state.nextWeek+'/'+this.state.month+'/'+this.state.year});
			});
		}
	}

	getMonth = async() =>{
		if(this.state.month+1>12){
			this.setState({nextMonth:this.state.month+1-12,nextYear:this.state.year+1,getMonthSchedule:true},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year+'-'+this.state.date+'/'+this.state.nextMonth+'/'+this.state.year});
			});
		}
		else{
			this.setState({nextMonth:this.state.month+1,nextYear:this.state.year,getMonthSchedule:true},()=>{
			this.setState({text: this.state.date+'/'+this.state.month+'/'+this.state.year+'-'+this.state.date+'/'+this.state.nextMonth+'/'+this.state.year});
			});
		}
	}

	render(){
		return(
			<>
			<div className="date">
			<div className="view">
				<div className="viewType" onClick={this.getWeek}>Week</div>
				<div className="viewType" onClick={this.getMonth}>Months</div>
			</div>
			<div className="dateBar">
				<div onClick={this.prevDay}><img src={back} alt="back" className="next"/></div>
				<div><h4>{this.state.text}</h4></div>
				<div onClick={this.nextDay}><img src={next} alt="next" className="next"/></div>
			</div>
			</div>
			<ScheduleDiv {...this.state}/>
			</>
		);
	}
}

export default ScheduleDate;