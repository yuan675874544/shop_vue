<template>
  <div align="center">
    <h1>商品管理</h1>
    <el-card class="form-container" shadow="never">
      <el-steps  :active="active" finish-status="success" align-center>
        <el-step title="填写商品信息"></el-step>
        <el-step title="填写商品属性"></el-step>
        <el-step title="商品图片"></el-step>
      </el-steps>
    </el-card>
    <div style="margin-top: 50px" v-show="show1">
      <el-form :model="value"   label-width="120px" style="width: 600px" size="small">
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="value.name"></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="title">
          <el-input v-model="value.title"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="bandId">
          <el-select v-model="value.bandId" placeholder="请选择">
            <el-option v-for="b in brandDatas" :key="b.iid" :label="b.name" :value="b.iid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
            :autoSize="true"
            v-model="value.productdecs"
            type="textarea"
            placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="value.price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存：">
          <el-input v-model="value.stocks"></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model="value.sortNum"></el-input>
        </el-form-item>
        <!-- 图片插件  -->
        <el-form-item label="主图" prop="imgPath">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8080/PinController/uploadFile"
            :show-file-list="false"
            :on-success="imgCallBack"
            name="img"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 180px">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="handleNext1">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  v-show="show2">
      <el-form :model="productForm2"   label-width="120px" style="width: 600px" size="small">
        <el-form-item>
          <el-button type="primary" size="medium" @click="handleNext2">上一步</el-button>
        </el-form-item>


        <!--   第一部分  分类部分-->
        <el-form-item label="分类" prop="typeId">
          <!--  改变 获取属性数据  -->
          <el-select v-model="productForm.typeId" placeholder="请选择" @change="showAttrDataAndSkuData">
            <el-option v-for="b in typeDatas" :key="b.id" :label="b.name" :value="b.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">
          <el-form-item v-for="a in  SKUData" :key="a.sid" :label="a.nameCH">
            <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
            <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>
            <el-select v-if="a.type==0"  placeholder="请选择" v-model="xiala">
              <el-option v-for="b in a.values" :key="b.sid"  :label="b.nameCH" value="b.sid"></el-option>
            </el-select>
            <el-radio-group v-if="a.type==1" v-model="a.danxuan">
              <el-radio v-for="b in a.values" :key="b.sid" :label="b.nameCH"></el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="a.type==2" v-model="a.ckValues" @change="skuChange">
              <el-checkbox v-for="b in a.values" :key="b.sid" :label="b.nameCH" ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>

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
        <el-button type="primary" @click="addProduct">添加</el-button>
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

      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Shop",
    data(){
      return{
        /* 第一步相关的数据 */
        value:{
          name:"",
          title:"",
          bandId:"",
          productdecs:"",
          price:"",
          stocks:"",
          sortNum:"",
          imgPath:""
        },
        /*图片展示用的*/
        imageUrl:"",
        /*进度条*/
        show1:true,
        show2:false,
        active: 0,
        /*商品类型*/
        ajaxTypeData:[],
        /*品牌*/
        brandDatas:[],
        /*第二页*/
       productForm2:{
          typeId:""
        },
        typeDatas:[], // 子节点的分类数据  [ {"id": 15, "name": "电视",  "pid": 5},]
        productForm:{
        },
        SKUData:[],//商品规格的数据 [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
        attData:[],
        danxuan:"",
        xiala:"",
        tableSkuData:[],/* 格式写出来  */
        types:[],
        cols:[],//动态表头 {id:,name:"",nameCH:""}
        tableShow:false,//表格是否显示
      }
    },methods:{
      /*新增商品*/
      addProduct:function(){
        debugger
        //商品的类型id 添加到productform
        this.value.typeId=this.productForm.typeId;
        console.log(this.value);
        //非sku的数据
        console.log(this.attData);
        //sku数据
        console.log(this.tableSkuData);
        //声明后台接参的atrr
        let atrrs=[];
        for (let i = 0; i <this.attData.length ; i++) {
          let  attData={};
          attData[this.attData[i].name]=this.attData[i].ckValues;
          atrrs.push(attData)
          debugger
        }
        this.value.attr=JSON.stringify(atrrs);
        this.value.sku=JSON.stringify(this.tableSkuData);
        //发起请求
        this.$ajax.post("http://127.0.0.1:8080/ShopController/add",this.$qs.stringify(this.value)).then(res=>{
          alert("添加成功");
        })
      },
      /*品牌*/
      queryData: async  function () {
          //商品的分页数据
        let param={current:1,size:100000000};
        let res=await this.$ajax.post("http://127.0.0.1:8080/PinController/list",this.$qs.stringify(param));
        this.brandDatas = res.data.data.list;
      },
      /*判断页面是否显示*/
      handleNext1:function(){
        this. show1=false;
        this.show2=true;
        if (this.active >=3){
          this.active = 0;
        }else {
          this.active++;
        }
      },
      /*上一步*/
      handleNext2:function(){
        this. show1=true;
        this.show2=false;
        if (this.active >=3){
          this.active = 0;
        }else {
          this.active--;
        }
      },
      //初始化所有的分类数据
      initTypeDatas:async function(){
        //所有的分类数据
        let res=await  this.$ajax.get("http://127.0.0.1:8080/TypeController/getData");
        this.getChildrenNode(res.data.data.data);
      },
      //给子节点数据赋值
      getChildrenNode:function(datas){
        //判断当前节点是否为子节点
        for (let i = 0; i < datas.length; i++) {
          //得到一个分类数据
          let  node=datas[i];
          let  nodeFlag=true; //默认当前节点是子节点
          //遍历所有的分类数据
          for (let j = 0; j <datas.length; j++) {
            //判断当前节点是否为子节点       当前节点数据  在所有的数据中 是否有pid指向当前id的
            if(node.id==datas[j].pid){
              nodeFlag=false;
              break;
            }
          }
          //判断是否为子节点
          if(nodeFlag==true){
            this.typeDatas.push(node);
          }
        }
      },
      /*图片上传*/
      imgCallBack(res, img) {
        debugger;
        //打断点 看怎么取返回值
        this.value.imgPath=res.data;
        //显示赋值
        this.imageUrl=res.data;
      },
      //处理显示商品规格和参数的内容
      showAttrDataAndSkuData:function(){
        //获取此分类下的sku数据和attr 数据
        this.$ajax.get("http://127.0.0.1:8080/ShuController/queryDatasType?typeId="+this.productForm.typeId).then(res=>{

          //处理sku的

          //得到所有的sku数据
          this.SKUData=res.data.data.skuDatas;
          //商品规格 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
          for (let i = 0; i <this.SKUData.length ; i++) {
            this.SKUData[i].ckValues=[];
          }
          console.log(this.SKUData);

          //处理attr数据
          this.attData=res.data.data.attrDatas;

          //商品规格  复选框 设置初始化值 添加一个属性 ckValues  []  [{"id": 3, "name": "color", "nameCH": "颜色", "values": [{"id": 5, "value": "red", "valueCH": "红色",}]
          for (let i = 0; i <this.attData.length ; i++) {
            if(this.attData[i].type==2){
              this.attData[i].ckValues=[];
            }
          }

        })
      },
      skuChange:function(){
        //强制刷新组件
        this.$forceUpdate();

        //笛卡尔积的参数
        let  kdej=[];
        //清空表格数据
        this.tableSkuData=[];
        //清空动态表头数据
        this.cols=[];
        // console.log(this.SKUData);
        //判断是否要生成笛卡尔积
        let flag=true;

        //遍历sku所有数据
        for (let i = 0; i <this.SKUData.length ; i++) {
          //将sku属性 放入动态表头中
          this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH,"name":this.SKUData[i].name});

          //将此属性选中的选项值放入笛卡尔积参数中
          //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
          kdej.push(this.SKUData[i].ckValues);
          //判断此sku的复选框是否为选中
          if(this.SKUData[i].ckValues.length==0){
            flag=false; // 不能生成笛卡尔积
            break;
          }
        }
        if(flag==true){
          //debugger;
          // alert("生成笛卡尔积");
          //生成table的数据  [[],[],[]]   [{},{},{}]
          let  datas=this.calcDescartes(kdej);
          //遍历数据  [[红色,16g],[绿色,16g],[黑色，16g]]
          for (let i = 0; i <datas.length ; i++) {
            //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]

            let  jsonData={}; //笛卡尔积 转为json的对象
            for (let j = 0; j <datas[i].length ; j++) {
              //获取数据的key
              let  key=this.cols[j].name;
              jsonData[key]=datas[i][j]

            }
            this.tableSkuData.push(jsonData);
          }
        }
        this.tableShow=flag;
      },

      /* 笛卡尔积    */
      calcDescartes:function(array) {
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
      },
    }, created: async function () {
      await this.initTypeDatas();
     await this.queryData();
    }
  }
</script>

<style scoped>

</style>
