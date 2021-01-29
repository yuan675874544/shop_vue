<template>
  <div align="center">
      <h1>属性展示</h1>
      <div style="width: 200px" >
        <el-form>
          名称:<el-input type="text" v-model="param.name" width="40px "></el-input>
          <el-button v-on:click="queryShuXing(1,4)">搜索</el-button>
          <h1 align="center" >属性管理</h1>
          <el-button type="success" @click="addFormFlag=true">新增</el-button>
        </el-form>
      </div>
      <div id="shuTable">

        <el-table
          :data="shuxingData"
          style="width: 100%">
          <el-table-column
            prop="sid"
            label="序号"
            width="180">
          </el-table-column>

          <el-table-column
            prop="typeId"
            label="类型"
            :formatter="formaTypeId">
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
              <el-button type="danger" v-if="scope.row.type!=3" icon="el-icon-delete"  @click= "queryValue(scope.row)">属性值维护</el-button>
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
      <div>
        <!--新增模板-->
        <el-dialog title="属性新增信息" :visible.sync="addFormFlag">
          <el-form :model="addForm" ref="addForm"  label-width="80px">
            <el-form-item label="英文名称" prop="name">
              <el-input v-model="addForm.name" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="中文名称" prop="nameCH">
              <el-input v-model="addForm.nameCH" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="addForm.typeId" placeholder="请选择分类">
                <el-option label="请选择" :value="-1"></el-option>
                <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择">
                <el-option
                  v-for="item in leixngData"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SKU" prop="isSKU">
              <el-switch
                v-model="addForm.isSKU"
                active-text="是"
                active-color="#13ce66"
                :active-value="1"
                inactive-text="否"
                :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="add">确 定</el-button>
            <el-button @click="addFormFlag = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <!--修改模板-->
      <el-dialog :title="属性修改信息" :visible.sync="updateFormFlag">
        <el-form :model="updateForm" ref="updateForm"  label-width="80px">
          <el-form-item label="英文名称" prop="name">
            <el-input v-model="updateForm.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="updateForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="updateForm.typeId" placeholder="请选择分类">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="updateForm.type" placeholder="请选择">
              <el-option
                v-for="item in leixngData"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SKU" prop="isSKU">
            <el-switch
              v-model="updateForm.isSKU"
              active-text="是"
              active-color="#13ce66"
              :active-value="1"
              inactive-text="否"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="update">确 定</el-button>
          <el-button @click="updateFormFlag = false">取 消</el-button>
        </div>
      </el-dialog>
    <div>

    <!--这是属性展示的模板-->
    <el-dialog :title="valueTitle" :visible.sync="showValueFormFlag">
      <el-table
        :data="valueData"
        style="width: 100%">
        <el-table-column
          prop="vid"
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
          label="属性中文文名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="attId"
          label="属性值id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="vid"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete"  @click="deleteAttid(scope.row.vid)"></el-button>
            <el-button type="primary" icon="el-icon-edit"   @click="toUpdateshuxingValue(scope.row.vid)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addValueFormAalg=true">新增</el-button>
    </el-dialog>
    </div>
    <!--属性值新增的的模板-->

    <div>
      <el-dialog :title="xinzeng" :visible.sync="addValueFormAalg">
        <el-form :model="addValueForm"   :rules="valuerules" label-width="80px">
          <el-form-item label="英文名称" prop="name">
            <el-input v-model="addValueForm.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="addValueForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addValue">确 定</el-button>
          <el-button @click="addValueFormAalg = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--属性值修改的模板-->
    <div>
      <el-dialog :title="xiougai" :visible.sync="updateValueFormFlag">
        <el-form :model="updateValueForm"    label-width="80px">
          <el-form-item label="英文名称" prop="name">
            <el-input v-model="updateValueForm.name" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="updateValueForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateValue">确 定</el-button>
          <el-button @click="updateValueFormFlag = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    </div>

</template>

<script>
    export default {
        name: "Shu",
      data(){
          return{
            arr:"",
            totalPage: 0,//总条数
            pageSizes: [5, 10, 15, 20],//每页展示几条
            current: 1,  //当前也
            size: 4, //每页展示条数
            param:{
              name:""
            },
            shuxingData:[],
            //类型的数据
            /*  需要数据做转换   */
            ajaxTypeData:[],
            typeName:"",
            types:[],
            leixngData:[{type:0,name:"下拉框"},{type:1,name:"单选框"},{type:2,name:"复选框"},{type:3,name:"输入框"}],
            /* 新增模块的数据  */

            addFormFlag:false,
            addForm:{
              sid:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            //修改的模板
            updateFormFlag:false,
            updateForm:{
              sid:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:""
            },
            //属性值维护的模板
            valueData:[],
            showValueFormFlag:false,
              name:"",
              nameCh:"",
              attId:"",
            //属性值新增的数据
            addValueFormAalg:false,
            addValueForm:{
              name:"",
              nameCH:"",
            },
            //属性值修改的数据
            updateValueFormFlag:false,
            updateValueForm:{
             name:"",
             nameCH:""
            },
            valueTitle:"",
            xinzeng:"",
            xiougai:""
          }
      },methods:{

        update: function () {
          debugger
          var uthis = this;
          //发起请求
          this.$ajax.post("http://127.0.0.1:8080/ShuController/update",this.$qs.stringify(this.updateForm)).then(function () {
            alert("修改成功");
            uthis.updateFormFlag = false;
            uthis.queryShuXing(1,4);
          }).catch(function () {
            console.log("发送请求失败");
          })
        },
        //回显
        toUpdateshuxing(sid){
          this.updateFormFlag=true;
          this.$ajax.get("http://127.0.0.1:8080/ShuController/getDataByid?sid="+sid+"").then(res=>{
            this.updateForm=res.data.data;
          }).catch(err=>console.log(err));
        },
        add(){
          console.log(this.addForm)
          var add=this.$qs.stringify(this.addForm)
          this.$ajax.post("http://127.0.0.1:8080/ShuController/add?"+add).then(res=>{
            // 把请求的数据  赋给全局
            this.addFormFlag=false;
            this.queryShuXing(1,4);
          }).catch(err=>console.log(err));
        },
          //逻辑删除
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
            this.queryShuXing(1,4);
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
        },     handleCurrentChange(val) {
          var hthis = this;
          hthis.queryShuXing(val, hthis.param.size);
        },
        handleSizeChange(val) {

          var sthis = this;
          sthis.queryShuXing(1, val);
        },
        formaTypeId(row,column,value,index){
          for (let i = 0; i <this.ajaxTypeData.length; i++) {
            if(value==this.ajaxTypeData[i].id)
            {return this.ajaxTypeData[i].name}
          }
        },
        SKU(row,column,value,index){
          return value==0?"是":"否"
        },
        /* 新增相关的  */
        formaterTypeData:function(){

          this.$ajax.get("http://127.0.0.1:8080/TypeController/getData").then(res=>{
            this.ajaxTypeData=res.data.data.data;
            //{"id":7,name:"分类/电子产品/手机"},
            //先找到子节点的数据   this.types;
            this.getChildrenType();
            //遍历所有的子节点
            for (let i = 0; i <this.types.length ; i++) {
              this.typeName=""; // 全局变量   临时存 层级名称
              //处理子节点的name属性
              this.chandleName(this.types[i]);
              //   a/b/c/f/d/e
              //给name重新赋值
              this.types[i].name=this.typeName.split("/").reverse().join("/").substring(0,this.typeName.length-1);
            }
          })
        },
        //给我一个节点  得到层级name
        chandleName:function(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.ajaxTypeData.length ; i++) {
              if(node.pid==this.ajaxTypeData[i].id){
                this.chandleName(this.ajaxTypeData[i]);
                break;
              }
            }

          }else{
            this.typeName+="/"+node.name;
          }
        },
        //得到types的数据      遍历所有ajaxtypedata
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            let  node=this.ajaxTypeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode:function(node){
          let rs=true;
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            if(node.id==this.ajaxTypeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.types.push(node);
          }
        },
        queryValue:function(row){
          //请求数据
          this.attId=row.sid;
          this.valueTitle=row.nameCH+"的信息";
          this.xinzeng=row.nameCH+"新增的信息";
          this.xiougai=row.nameCH+"修改的信息";
          this.showValueFormFlag=true;
          var bthis = this;
          this.$ajax.get("http://127.0.0.1:8080/ShuValueController/queryAll?attId="+row.sid+"").then(function (rs) {
            //属性值数据
            bthis.valueData = rs.data.data;
          })
        },
        //逻辑删除
        deleteAttid(vid){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ajax.post("http://127.0.0.1:8080/ShuValueController/deleteIsdel?vid="+vid+"").then(res=>{
              // 把请求的数据  赋给全局
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              location.reload()
            }).catch(err=>console.log(err));
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        addValue(){
        this.addValueForm.attId=this.attId;
          var add=this.$qs.stringify(this.addValueForm)
          this.$ajax.post("http://127.0.0.1:8080/ShuValueController/add?"+add).then(res=>{
            // 把请求的数据  赋给全局
            alert("新增成功")
            this.addValueFormAalg=false;
            location.reload()
          }).catch(err=>console.log(err));
        },
        //回显
    toUpdateshuxingValue(vid){
      this.updateValueFormFlag=true;
      this.$ajax.get("http://127.0.0.1:8080/ShuValueController/getDataByid?vid="+vid+"").then(res=>{
        this.updateValueForm=res.data.data;
      }).catch(err=>console.log(err));
    },
        //修改
        updateValue(){
          var update=this.$qs.stringify(this.updateValueForm);
          var uthis=this;
          this.$ajax.post("http://127.0.0.1:8080/ShuValueController/update?"+update).then(res=>{
            // 把请求的数据  赋给全局
            uthis.updateValueFormFlag=false;
           location.reload()
          }).catch(err=>console.log(err));
        },
      }, created:function () {
        this.formaterTypeData();
        this.queryShuXing(1,5);
        this.queryValue(attId);
      }
    }
</script>

<style scoped>

</style>
