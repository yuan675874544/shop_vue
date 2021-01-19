<template>
    <div align="center">
      <div style="width: 200px" >
      <el-form>
      名称:<el-input type="text" v-model="param.name" width="40px "></el-input>
      <el-button v-on:click="queryData(1,4)">搜索</el-button>
      <h1 align="center" >品牌管理</h1>
      <el-button type="success" @click="addFormFlag=true">新增</el-button>
      </el-form>
      </div>
      <div id="pinTable">

        <el-table
          :data="pinData"
          style="width: 100%">
          <el-table-column
            prop="iid"
            label="序号"
            width="180">
          </el-table-column>

          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="imgPath"
            label="图片">
            <!-- 按文本处理   :formatter="formatImg"    -->
            <!-- 模板处理  html  -->
            <template slot-scope="scope">
              <img width="50px" :src="scope.row.imgPath"/>
            </template>
          </el-table-column>

          <el-table-column
            prop="bandE"
            label="开头字母">
          </el-table-column>

          <el-table-column
            prop="bandDesc"
            label="品牌故事">
          </el-table-column>

          <el-table-column
            prop="ord"
            label="排序">
          </el-table-column>
          <el-table-column
            prop="isdel"
            label="是否展示">
          </el-table-column>
          <el-table-column
            prop="author"
            label="创建人">
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="handleEdit( scope.row)">编辑</el-button>
              <el-button type="success" @click="delisDel(scope.row.iid)">删除</el-button>

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
      <!--新增的弹框-->
      <el-dialog title="录入商品信息" :visible.sync="addFormFlag">

        <el-form :model="addPinForm" ref="addPinForm" :rules="rule"  label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input v-model="addPinForm.name" autocomplete="off" ></el-input>
          </el-form-item>



          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8080/PinController/uploadFile"
              :on-success="imgCallBack"
              name="img"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="开头字母" prop="price">
            <el-input v-model="addPinForm.bandE"></el-input>
          </el-form-item>

          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="addPinForm.bandDesc"
              maxlength="50"
              show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-form-item label="排序" prop="ord">
            <el-input v-model="addPinForm.ord"></el-input>
          </el-form-item>

          <el-form-item label="是否展示" prop="isdel">
            <el-input v-model="addPinForm.isdel"></el-input>
          </el-form-item>

          <el-form-item label="创建人" prop="author">
            <el-input v-model="addPinForm.author"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
        </div>



      </el-dialog>
      <!--修改的弹框-->
      <el-dialog title="录入商品信息" :visible.sync="updateFormFlag">

        <el-form :model="updatePinForm" ref="updatePinForm" :rules="rule"  label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input v-model="updatePinForm.name" autocomplete="off" ></el-input>
          </el-form-item>



          <el-form-item label="图片">
            <img width="50px" :src="updatePinForm.imgPath"/>
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8080/PinController/uploadFile"
              :on-success="imgCallBack"
              name="img"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="开头字母" prop="price">
            <el-input v-model="updatePinForm.bandE"></el-input>
          </el-form-item>

          <el-form-item label="品牌故事" prop="bandDesc">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="updatePinForm.bandDesc"
              maxlength="50"
              show-word-limit
            >
            </el-input>
          </el-form-item>

          <el-form-item label="排序" prop="ord">
            <el-input v-model="updatePinForm.ord"></el-input>
          </el-form-item>

          <el-form-item label="是否展示" prop="isdel">
            <el-input v-model="updatePinForm.isdel"></el-input>
          </el-form-item>



          <el-form-item label="创建人" prop="author">
            <el-input v-model="updatePinForm.author"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>

      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Pin",
      data(){
          return{
            pinData:[],
            totalPage: 0,//总条数
            pageSizes: [5, 10, 15, 20],//每页展示几条
            current: 1,  //当前也
            size: 4, //每页展示条数
            param:{},
        /* 新增模块的数据  */
        addFormFlag:false,
            addPinForm:{
              name:"",
              bandE:"",
              imgPath:"",
              ord:"",
              bandDesc:"",
              isdel:"",
              author:""
            },
            /*修改模块数据*/
            updateFormFlag:false,
            updatePinForm:{
              name:"",
              bandE:"",
              imgPath:"",
              ord:"",
              bandDesc:"",
              isdel:"",
              author:""
            },
          }
      },
      methods:{
        queryData:function (current,size) {
          this.param.current = current;
          this.param.size = size;

          //请求数据
          var bthis = this;
          this.$ajax.post("http://127.0.0.1:8080/PinController/list", this.$qs.stringify(this.param)).then(function (rs) {
            //商品的分页数据
            bthis.pinData = rs.data.data.list;
            bthis.totalPage = rs.data.data.count;
          })
        },
        handleCurrentChange(val) {
          var hthis = this;
          hthis.queryData(val, hthis.param.size);
        },
        handleSizeChange(val) {

          var sthis = this;
          sthis.queryData(1, val);
        },
        imgCallBack:function(response, img, fileList){ //图片上传的回调函数
          // 赋值
          this.addPinForm.imgPath=response.data;
          this.updatePinForm.imgPath=response.data;
        },
        addForm:function(){
          var athis=this;
          //发起请求
          this.$ajax.post("http://127.0.0.1:8080/PinController/add", this.$qs.stringify(this.addPinForm)).then(function () {
            //关闭弹框
            alert("新增成功")
            athis.addFormFlag = false;
            location.reload();
          })
        },handleEdit:function(row){
          debugger
          this.updateFormFlag=true;
          var uthis=this;
          this.$ajax.get("http://127.0.0.1:8080/PinController/getDataByid?pid=" +row.iid ).then(function (res) {

            var updateData = res.data.data
            uthis.updatePinForm.iid=updateData.iid;
            uthis.updatePinForm.name=updateData.name;
            uthis.updatePinForm.bandE=updateData.bandE
            uthis.updatePinForm.imgPath=updateData.imgPath;
            uthis.updatePinForm.bandDesc=updateData.bandDesc
            uthis.updatePinForm.ord=updateData.ord
            uthis.updatePinForm.isdel=updateData.isdel;
            uthis.updatePinForm.author=updateData.author
          })

        },    update: function () {
          debugger
          var athis = this;
          //发起请求
         this.$ajax.post("http://127.0.0.1:8080/PinController/update", this.$qs.stringify(this.updatePinForm)).then(function () {
            alert("修改成功");
            athis.updateFormFlag = false;
            athis.queryData(1,5);
          }).catch(function () {
            console.log("发送请求失败");
          })


        },delisDel:function (iid) {
          debugger
          var athis=this;
          this.$ajax.post("http://127.0.0.1:8080/PinController/deleteIsdel?iid="+iid  ).then(function () {
            alert("成功");
            athis.queryData(1,5);
          }).catch(function () {
            console.log("发送请求失败");
          })

        }
      },created:function () {
        this.queryData(1,5);
      }
    }
</script>

<style scoped>

</style>
