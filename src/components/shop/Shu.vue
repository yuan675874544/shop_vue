<template>
    <div>
      <h1>属性展示</h1>
      <div id="shuTable">
        <el-table
          :data="shuxingData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="属性英文名称"
            width="180">
          </el-table-column>

          <el-table-column
            prop="nameCH"
            label="属性中文名字"
          >
          </el-table-column>

          <el-table-column
            prop="typeId"
            label="类型"
            :formatter="formaTypeId">
          </el-table-column>

          <el-table-column
            prop="isSKU"
            label="SKU"
            :formatter="SKU"
          >
          </el-table-column>

          <el-table-column
            prop="sid"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"   @click="toUpdateshuxing(scope.row.sid)"></el-button>
              <el-button type="danger" icon="el-icon-delete"  @click="deleteIsdel(scope.row.sid)"></el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="pageSizes"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Shu",
      data(){
          return{
            totalPage: 0,//总条数
            pageSizes: [5, 10, 15, 20],//每页展示几条
            current: 1,  //当前也
            size: 5, //每页展示条数
            param:{},
            shuxingData:[],
            //类型的数据
            typeData:[],
            leixngData:[{type:0,name:"下拉框"},{type:1,name:"单选框"},{type:2,name:"复选框"},{type:3,name:"输入框"}],
          }
      },methods:{//逻辑删除
        deleteIsdel(sid){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post("http://127.0.0.1:8080/ShuController/deleteIsdel?sid="+sid+"").then(res=>{
            // 把请求的数据  赋给全局
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryShuXing(1);
          }).catch(err=>console.log(err));
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
        queryShuXing:function (current,size) {
          this.param.current = current;
          this.param.size = size;

          //请求数据
          var bthis = this;
          this.$ajax.post("http://127.0.0.1:8080/ShuController/queryShuData", this.$qs.stringify(this.param)).then(function (rs) {
            //商品的分页数据
            bthis.shuxingData = rs.data.data.list;
            bthis.totalPage = rs.data.data.count;
          })
        },    handleCurrentChange(val) {
          var hthis = this;
          hthis.queryData(val, hthis.param.size);
        },
        handleSizeChange(val) {

          var sthis = this;
          sthis.queryData(1, val);
        },   formaTypeId(row,column,value,index){
          for (let i = 0; i <this.typeData.length; i++) {
            if(value==this.typeData[i].id)
            {return this.typeData[i].name}
          }
        },
        SKU(row,column,value,index){
          return value==1?"是":"否"
        },queryType(){
          this.$ajax.get("http://127.0.0.1:8080/TypeController/getData").then(res=>{
            this.typeData=res.data.data;
            for (let i = 0; i <res.data.data.length ; i++) {
              if(res.data.data[i].pid==0){
                this.diguiNode(res.data.data[i]);
                break;
              }
            }
          }).catch(err=>console.log(err));
        },     diguiNode:function (node) {
          // 判断是否为父节点
          var bf=this.isParent(node);
          console.log(bf)
          if(bf==true){
            for (let i = 0; i <this.typeData.length ; i++) {
              //判断是否为当前节点的子节点
              if(node.id==this.typeData[i].pid){
                this.diguiNode(this.typeData[i]);
              }
            }
          }
          if(bf==false){
            console.log(node)
            this.bandData.push(node)
          }
        },
        isParent:function(node){// 判断是否为父节点  pid 有没有指向当前id
          for (let i = 0; i <this.typeData.length ; i++) {
            if(node.id==this.typeData[i].pid){
              console.log(1)
              return true;
            }
          }
          return false;
        }
      }, created:function () {
        this.queryType();
        this.queryShuXing(1,4);
      }
    }
</script>

<style scoped>

</style>
