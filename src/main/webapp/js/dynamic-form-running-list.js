$(function () {
	//$('#dlg').dialog('close');
	$('#dg').datagrid({
		  height: 340,
		  url: projectName+'/form/dynamic/process-instance/running/list?timestamp='+new Date().getTime(),
		  method: 'GET',
		  //queryParams: { 'id': id },
		  //idField: 'id',
		  loadMsg: "正在努力为您加载数据", //加载数据时向用户展示的语句
		  striped: true,//是否显示斑马线效果
		  fitColumns: true, //设置为true将自动使列适应表格宽度以防止出现水平滚动,false则自动匹配大小
		  singleSelect: false,//是否单选
		  rownumbers: true,
		  pagination: true, //显示最下端的分页工具栏
		  //nowrap: false,
		  pageSize: 10,//读取分页条数，即向后台读取数据时传过去的值
		  pageList: [10, 20, 50, 100],//可以调整每页显示的数据，即调整pageSize每次向后台请求数据时的数据
          //sortName: "name", //初始化表格时依据的排序 字段 必须和数据库中的字段名称相同
          //sortOrder: "asc", //正序
		  showFooter: true,
		  columns: [[
		    /*{ field: 'ck', checkbox: true },*/
		    {field:'id', title: '执行ID', width: 100, align: 'left' },
		    {field:'processInstanceId', title: '流程实例ID', width: 100, align: 'left' },
		    {field:'processDefinitionId', title: '流程定义ID', width: 100, align: 'left' },
		    {field:'processDefinitionName', title: '流程定义名称', width: 180, align: 'left' },
		    {field:'activityName', title: '当前节点', width: 100, align: 'left',
	            formatter:function(val,row,index){
	            	//return "<a target='_blank' title='点击查看流程图' href='"+projectName+"/diagram-viewer/index.html?processDefinitionId="+row.processDefinitionId+"&processInstanceId="+row.processInstanceId+"'>"+row.activityName+"</a>";
	                return "<a href='javascript:void(0)' onclick='currentNode("+index+")'>"+row.activityName+"</a>";  
	            }
		    },
		    {field:'suspended', title: '是否挂起', width: 30, align: 'center',
	            formatter:function(val,row,index){
	            	if(row.suspended){
	                    return "是";
	                } else {
	                	return "否";  
	                }
	            }
	        }
		  ]],
		  onBeforeLoad: function (param) {
		  },
		  onLoadSuccess: function (data) {
		  },
		  onLoadError: function () {
		     
		  },
		  onClickRow: function (rowIndex, field, value) {
			  $(this).datagrid('unselectRow', rowIndex);
		  },
		  onClickCell: function (rowIndex, field, value) {
		  }
		});
});

/**
 * 当前节点
 * @param index
 */
function currentNode(index){
	var myw = document.documentElement.clientWidth * 0.85;
    var myh = document.documentElement.clientHeight * 0.85;
	
	$('#dg').datagrid('selectRow',index);
	var row = $('#dg').datagrid('getSelected');
	var url = projectName + "/diagram-viewer/index.html?processDefinitionId="+row.processDefinitionId+"&processInstanceId="+row.processInstanceId;
	$("#node-dialog").dialog({
	    title:'当前节点[' + row.activityName + ']',
	    /*fit:true,*/
	    width:myw,
	    height:myh,
	    resizable:true,
	    closed: true,
	    modal:true,
	    dragable: false,
	    //href:'faqilc.html',
	    content:"<iframe scrolling='auto' frameborder='0' src='"+url+"' style='width:100%; height:99%; display:block;'></iframe>",
	    buttons:[{
			text:'关闭',
			handler:function(){$("#node-dialog").dialog("close");}
		}]
	});
	$("#node-dialog").dialog("open");
	$('#node-dialog').window('center');
}
