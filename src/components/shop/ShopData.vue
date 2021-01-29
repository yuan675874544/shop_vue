<template>
  <div align="center">
    <div style="width: 200px" >

      <el-form>
        名称:<el-input type="text" v-model="param.name" width="40px "></el-input>
        <el-button v-on:click="queryData(1,4)">搜索</el-button><br>
        <router-link to="/Shop"><el-button type="primary" round size="small">新增</el-button></router-link>
        <h1 align="center" >商品管理</h1>
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
          width="80">
        </el-table-column>
        <el-table-column
          prop="imgPath"
          label="图片"
        >
          <!-- 按文本处理   :formatter="formatImg" -->
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
            <el-button type="text" size="small" @click="showAttrInfo(scope.row.typeId,scope.row.shopId)">属性维护</el-button>          </template>
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
    <el-dialog title="属性信息" :visible.sync="attrShow">
      <!--  分几大块     1  分类下拉框   2 sku数据模块   3  表格模块    4 attr数据模块   -->
      <!--  form 表单      包含几部分    四部分    1  分类     2  sku   3 table  4 attr   -->
      <el-form :model="productForm" label-width="100px" class="demo-ruleForm">


        <!--   第一部分  分类部分-->
        <el-form-item label="分类" prop="typeId">
          <!--  改变 获取属性数据  -->
          <el-select v-model="productForm.typeId" placeholder="请选择">
            <el-option v-for="b in typeDatas" :key="b.id" :label="b.name" :value="b.id"></el-option>
          </el-select>
        </el-form-item>



        <!--  第二部分   商品规格  -->
        <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">
          <!--  skudata数据  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}] -->
          <!--  遍历的商品的规格  -->
          <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">

            <!--  sku只有一个类型   复选框  遍历的是规格的选项  -->
            <el-checkbox-group  v-model="a.ckValues"  @change="skuChange">
              <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCh"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>



        <!--  第三部分  -->

        <el-table
          v-if="tableShow"
          :data="tableSkuData"
          style="width: 100%">
          <!--   动态展示列头  sku属性中文名 -->
          <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
          </el-table-column>

          <el-table-column
            label="库存"
            width="180">

            <template slot-scope="scope">
              <el-input v-model="scope.row.storcks"/>
            </template>

          </el-table-column>
          <el-table-column
            label="价格"
            width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pricess"/>
            </template>
          </el-table-column>
        </el-table>






        <el-form-item v-if="attData.length>0" label="商品参数" prop="name">
          <el-form-item v-for="a in  attData" :key="a.sid" :label="a.nameCH">
            <template slot-scope="scope">
              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>
              <el-select v-if="a.type==0"  placeholder="请选择" v-model="a.ckValues">
                <el-option v-for="b in a.values" :key="b.sid"  :label="b.nameCH" value="b.id"></el-option>
              </el-select>
              <el-radio-group v-if="a.type==1" v-model="a.ckValues">
                <el-radio v-for="b in a.values" :key="b.sid" :label="b.nameCH"></el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" >
                <el-checkbox v-for="b in a.values" :key="b.sid" :label="b.nameCH"  name="type"></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form-item>





      </el-form>

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
            param:{
              name:"",
            },
            /*修改*/
            brandDatas:[],
            updateFormFlag:false,
            attrShow:false,
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
            },
            /*属性值维护*/
            tableData:[],
            attrShow:false,
            typeDatas:[],// 分类数据

            productForm:{
              typeId:""
            },

            SKUData:[],//商品规格的数据 [{"id": 3, "name": "color", ckValues:["复选框的选中状态"], "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
            attData:[],
            tableShow:false, //控制表格的显示
            tableSkuData:[],/* 格式写出来  sku的属性   [{cols.name:笛卡尔积的值,pricess：,storcks}]      */
            cols:[],//动态表头[ {id:skudata.id,name:skudata.name,nameCH:skudata.nameCH}]



            xiala:[],
            danxuan:[],
          }
      },methods: {
        queryData: function (current, size) {
          this.param.current = current;
          this.param.size = size;
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
        }, delisDel: function (shopId) {
          debugger
          var athis = this;
          this.$ajax.post("http://127.0.0.1:8080/ShopController/deleteIsdel?shopId=" + shopId).then(function () {
            alert("成功");
            athis.queryData(1, 5);
          }).catch(function () {
            console.log("发送请求失败");
          })
        }, imgCallBack: function (response, img, fileList) { //图片上传的回调函数
          // 赋值
          this.updateFrom.imgPath = response.data;
        }, queryDataBars: function () {
          //请求数据
          var bthis = this;
          this.$ajax.post("http://127.0.0.1:8080/PinController/list", this.$qs.stringify(this.param)).then(function (rs) {
            //商品的分页数据
            bthis.brandDatas = rs.data.data.list;
          })
        }, handleEdit: function (row) {
          debugger
          this.updateFormFlag = true;
          var uthis = this;
          this.$ajax.get("http://127.0.0.1:8080/ShopController/getDataByid?shopId=" + row.shopId).then(function (res) {

            var updateData = res.data.data
            uthis.updateFrom.shopId = updateData.shopId;
            uthis.updateFrom.name = updateData.name;
            uthis.updateFrom.title = updateData.title
            uthis.updateFrom.bandId = updateData.bandId;
            uthis.updateFrom.price = updateData.price;
            uthis.updateFrom.productdecs = updateData.productdecs
            uthis.updateFrom.imgPath = updateData.imgPath;
            uthis.updateFrom.stocks = updateData.stocks
            uthis.updateFrom.sortNum = updateData.sortNum
          })
        }, update: function () {
          var athis = this;
          //发起请求
          this.$ajax.post("http://127.0.0.1:8080/ShopController/update", this.$qs.stringify(this.updateFrom)).then(function () {
            alert("修改成功");
            athis.updateFormFlag = false;
            athis.queryData(1, 5);
          }).catch(function () {
            console.log("发送请求失败");
          })
        },


        //初始化所有的分类数据
        initTypeDatas: async function () {
          //所有的分类数据
          let res = await this.$ajax.get("http://127.0.0.1:8080/TypeController/getData");
          this.getChildrenNode(res.data.data.data);
        },
        //给子节点数据赋值
        getChildrenNode: function (datas) {
          //判断当前节点是否为子节点
          for (let i = 0; i < datas.length; i++) {
            //得到一个分类数据
            let node = datas[i];
            let nodeFlag = true; //默认当前节点是子节点
            //遍历所有的分类数据
            for (let j = 0; j < datas.length; j++) {
              //判断当前节点是否为子节点       当前节点数据  在所有的数据中 是否有pid指向当前id的
              if (node.id == datas[j].pid) {
                nodeFlag = false;
                break;
              }
            }
            //判断是否为子节点
            if (nodeFlag == true) {
              this.typeDatas.push(node);
            }
          }
        },
    /* 获取 sku的数据和attr的数据  */
    async function () {
      debugger
      //获取此分类下的sku数据和attr 数据
      let res = await this.$ajax.get("http://127.0.0.1/ShuController/queryDataByTypeId?typeId=" + this.productForm.typeId);
      //处理sku的
      //得到所有的sku数据
      this.SKUData = res.data.data.skuDatas;
      //商品规格 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
      for (let i = 0; i < this.SKUData.length; i++) {
        this.SKUData[i].ckValues = [];
      }
      //处理attr数据
      this.attData = res.data.data.attrDatas;
      //商品规格  复选框 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
      for (let i = 0; i < this.attData.length; i++) {
        if (this.attData[i].type == 2) {
          this.attData[i].ckValues = [];
        }
      }
    }

    ,
    huixianSKU:async function (pid) {

      //根据商品id查询对应的sku选中的值{"code":200,"message":"success",
      // "data":{"skudata":{"memsize":["32G"],"pricess":["222",111],"color":["绿色","红色"],"netType":["联通"],"storcks":["222",111]},"attrdata":{"peoples":["中年","老年","幼年"],"factory":"苹果尝试","system":"苹果系统","cpu":"骁龙1000"}}}
      let datas = await this.$ajax.get("http://127.0.0.1/ShopController/querySKUckvalues?pid=" + pid);

      //处理sku
      let data = datas.data.data.skudata;
      //遍历所有的sku属性
      for (let i = 0; i < this.SKUData.length; i++) {
        //得到一个sku属性
        this.SKUData[i].ckValues = data[this.SKUData[i].name];
      }

      //处理attr
      let data2 = datas.data.data.attrdata;
      //遍历所有的sku属性
      for (let i = 0; i < this.attData.length; i++) {
        //得到一个sku属性
        this.attData[i].ckValues = data2[this.attData[i].name];
      }

      //table赋值
      this.tableSkuData = datas.data.data.tableData;


    }
    ,
    showTable:function () {



      //判断是否需要回显table
      if (this.SKUData.length > 0) {
        this.tableShow = true;
        //设置动态表头 //动态表头[ {id:skudata.id,name:skudata.name,nameCH:skudata.nameCH}]
        for (let i = 0; i < this.SKUData.length; i++) {
          this.cols.push({"id": this.SKUData[i].id, "name": this.SKUData[i].name, "nameCH": this.SKUData[i].nameCH});
        }

      }

    }
    ,

    //显示修改内容
    showAttrInfo:async function (typeId, pid) {
      //显示弹框
      this.attrShow = true;
      //显示分类内容
      this.initTypeDatas();
      //回显分类
      this.productForm.typeId = typeId;
      //显示sku 和attr 内容
      await this.showAttrData();
      //回显sku的选项{"memsize":["32g"],"color":['红色','绿色'],"netType":'联通'}
      await this.huixianSKU(pid);

      //回显table
      this.showTable();
      this.$forceUpdate();


    }
    ,
        /* 获取 sku的数据和attr的数据  */
        showAttrData:async function(){
          debugger
          //获取此分类下的sku数据和attr 数据
          let res=await this.$ajax.get("http://127.0.0.1/ShopController/queryAttrDataByTypeId?typeId="+this.productForm.typeId);
          //处理sku的
          //得到所有的sku数据
          this.SKUData=res.data.data.skuDatas;
          //商品规格 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
          for (let i = 0; i <this.SKUData.length ; i++) {
            this.SKUData[i].ckValues=[];
          }
          //处理attr数据
          this.attData=res.data.data.attrDatas;
          //商品规格  复选框 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
          for (let i = 0; i <this.attData.length ; i++) {
            if(this.attData[i].type==2){
              this.attData[i].ckValues=[];
            }
          }
        },
    skuChange:function () {
      //强制刷新组件
      this.$forceUpdate();

      //笛卡尔积的参数
      let kdej = [];
      //清空表格数据
      this.tableSkuData = [];
      //清空动态表头数据
      this.cols = [];
      // console.log(this.SKUData);
      //判断是否要生成笛卡尔积
      let flag = true;

      //遍历sku所有数据
      for (let i = 0; i < this.SKUData.length; i++) {
        //将sku属性 放入动态表头中
        this.cols.push({"id": this.SKUData[i].id, "nameCH": this.SKUData[i].nameCH, "name": this.SKUData[i].name});

        //将此属性选中的选项值放入笛卡尔积参数中
        //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
        kdej.push(this.SKUData[i].ckValues);
        //判断此sku的复选框是否为选中
        if (this.SKUData[i].ckValues.length == 0) {
          flag = false; // 不能生成笛卡尔积
          break;
        }
      }
      if (flag == true) {
        //debugger;
        // alert("生成笛卡尔积");
        //生成table的数据  [[],[],[]]   [{},{},{}]
        let datas = this.calcDescartes(kdej);
        //遍历数据  [[红色,16g],[绿色,16g],[黑色，16g]]
        for (let i = 0; i < datas.length; i++) {
          //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]

          let jsonData = {}; //笛卡尔积 转为json的对象
          for (let j = 0; j < datas[i].length; j++) {

            //获取数据的key
            let key = this.cols[j].name;
            jsonData[key] = datas[i][j]

          }
          /* 格式写出来  sku的属性   [{cols.name:笛卡尔积的值,pricess：,storcks}]      */
          jsonData.pricess = 111;
          jsonData.storcks = 111;
          this.tableSkuData.push(jsonData);
        }
      }
      this.tableShow = flag;
    }
    ,

    /* 笛卡尔积    */
    calcDescartes:function (array) {
      if (array.length < 2) return array[0] || [];
      return [].reduce.call(array, function (col, set) {
        var res = [];
        col.forEach(function (c) {
          set.forEach(function (s) {
            var t = [].concat(Array.isArray(c) ? c : [c]);
            t.push(s);
            res.push(t);
          })
        });
        return res;
      });
    }
      },created:function () {
      this.queryData(1,5);
      this.queryDataBars();
    }
    }
</script>

<style scoped>

</style>
