import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { inject, observer } from 'mobx-react';



class CommonTable extends React.Component {
	constructor(props){
		super();
		var nameFilter= props.areaList.map(item=>({
			text:item,
			value:item
		}));
		const columns = [{
			title: '区域',
			dataIndex: 'area',
			key: 'area',
			filters: nameFilter,
			filterMultiple: true,
			onFilter: (value, record) => record.area.indexOf(value) === 0,
		}, {
			title: '项目名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '住房套数',
			dataIndex: 'number',
			key: 'number',
			sorter: (a, b) => a.number - b.number
		}, {
			title: '登记开始时间',
			dataIndex: 'beginTime',
			key: 'beginTime',
			sorter: (a, b) => new Date(a.beginTime) - new Date(b.beginTime)
		},{
			title: '登记结束时间',
			dataIndex: 'endTime',
			key: 'endTime',
			sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime)
		},{
			title: '报名状态',
			dataIndex: 'status',
			key: 'status',
			filters: [{
				text: '未报名',
				value: '未报名',
			}, {
				text: '正在报名',
				value: '正在报名',
			}, {
				text: '报名结束',
				value: '报名结束',
			}],
			filterMultiple: true,
			onFilter: (value, record) => record.status.indexOf(value) === 0,
			render: text => {
				if(text!='报名结束'){
					return <span style={{color:'green'}}>{text}</span>;
				} else {
					return text;
				}
			}
		}];
		this.state={
			columns
		};
	}
	render(){
		var data=this.props.appState.allData.map((item)=>{
			item.key=item._id;
			return item;
		});
		return <Table title={() => '汇总表'} columns={this.state.columns} dataSource={data} locale = {{
			filterTitle: '筛选',
			filterConfirm: '确定',
			filterReset: '重置',
			emptyText: '暂无数据'
		}} />;
	}
}

CommonTable.propTypes = {
	appState: PropTypes.object,
	areaList: PropTypes.array
};

export default inject('appState')(observer(CommonTable));
