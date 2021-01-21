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

        }
      },created:function () {
      this.queryData(1,5);
    }
    }
</script>

<style scoped>

</style>
