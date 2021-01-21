<template>
  <div align="center">
    <div style="width: 200px" >
      <el-form>
        <h1 align="center" >商品展示</h1>
      </el-form>
    </div>
    <div id="ShopTable">

      <el-table
        :data="ShopData"
        style="width: 100%">
        <el-table-column
          prop="shopId"
          label="序号"
          width="180">
        </el-table-column>

        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bandId"
          label="品牌"
          width="180">
        </el-table-column>
        <el-table-column
          prop="productdecs"
          label="品牌内容"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
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
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="handleEdit( scope.row)">编辑</el-button>
            <el-button type="success" @click="delisDel(scope.row.shopId)">删除</el-button>

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
    <!--修改的弹框-->
    <el-dialog title="修改商品信息" :visible.sync="updateFormFlag">
      <el-form :model="updateFrom"   label-width="120px" style="width: 600px" size="small">
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="updateFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="title">
          <el-input v-model="updateFrom.title"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="bandId">
          <el-select v-model="updateFrom.bandId" placeholder="请选择">
            <el-option v-for="b in brandDatas" :key="b.iid" :label="b.name" :value="b.iid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
            :autoSize="true"
            v-model="updateFrom.productdecs"
            type="textarea"
            placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="updateFrom.price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：">
          <el-input v-model="updateFrom.stocks"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <img width="50px" :src="updateFrom.imgPath"/>
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8080/PinController/uploadFile"
            :on-success="imgCallBack"
            name="img"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="updateFrom.sortNum"></el-input>
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
        name: "ShopData",
      data(){
          return{
            ShopData:[],
            totalPage: 0,//总条数
            pageSizes: [5, 10, 15, 20],//每页展示几条
            current: 1,  //当前也
            size: 4, //每页展示条数
            param:{},
            /*修改*/
            brandDatas:[],
            updateFormFlag:false,
            updateFrom:{
              shopId:"",
              name:"",
              title:"",
              bandId:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imgPath:""
            }
          }
      },methods:{
        queryData:function (current,size) {
          this.param.current = current;
          this.param.size = size;
          debugger
          //请求数据
          var bthis = this;
          this.$ajax.post("http://127.0.0.1:8080/ShopController/queryShopData", this.$qs.stringify(this.param)).then(function (rs) {
            //商品的分页数据
            bthis.ShopData = rs.data.data.list;
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
        },delisDel:function (shopId) {
          debugger
          var athis=this;
          this.$ajax.post("http://127.0.0.1:8080/ShopController/deleteIsdel?shopId="+shopId  ).then(function () {
            alert("成功");
            athis.queryData(1,5);
          }).catch(function () {
            console.log("发送请求失败");
          })
        },  imgCallBack:function(response, img, fileList){ //图片上传的回调函数
          // 赋值
          this.updateFrom.imgPath=response.data;
        }, queryDataBars:function () {
          //请求数据
          var bthis = this;
          this.$ajax.post("http://127.0.0.1:8080/PinController/list", this.$qs.stringify(this.param)).then(function (rs) {
            //商品的分页数据
            bthis.brandDatas = rs.data.data.list;
          })
        },handleEdit:function(row){
          debugger
          this.updateFormFlag=true;
          var uthis=this;
          this.$ajax.get("http://127.0.0.1:8080/ShopController/getDataByid?shopId=" +row.shopId ).then(function (res) {

            var updateData = res.data.data
            uthis.updateFrom.shopId=updateData.shopId;
            uthis.updateFrom.name=updateData.name;
            uthis.updateFrom.title=updateData.title
            uthis.updateFrom.bandId=updateData.bandId;
            uthis.updateFrom.price=updateData.price;
            uthis.updateFrom.productdecs=updateData.productdecs
            uthis.updateFrom.imgPath=updateData.imgPath;
            uthis.updateFrom.stocks=updateData.stocks
            uthis.updateFrom.sortNum=updateData.sortNum
          })
        },update: function () {
          debugger
          var athis = this;
          //发起请求
          this.$ajax.post("http://127.0.0.1:8080/ShopController/update", this.$qs.stringify(this.updateFrom)).then(function () {
            alert("修改成功");
            athis.updateFormFlag = false;
            athis.queryData(1,5);
          }).catch(function () {
            console.log("发送请求失败");
          })
        }
      },created:function () {
      this.queryData(1,5);
      this.queryDataBars();
    }
    }
</script>

<style scoped>

</style>
