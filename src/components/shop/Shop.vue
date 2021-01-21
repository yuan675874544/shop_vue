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
          <el-form :model="shuFrom"   label-width="120px" style="width: 600px" size="small">
            <el-form-item>
            <el-button type="primary" size="medium" @click="handleNext2">上一步</el-button>
          </el-form-item>
          <el-form-item label="商品分类" prop="typeId">
            <el-select v-model="shuFrom.typeId" placeholder="请选择" @change="getAttrData">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">
              <el-form-item v-for="a in  SKUData" :key="a.sid" :label="a.nameCH">
                <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
                <el-input v-if="a.type==3"></el-input>
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
            <!-- 笛卡尔积表格-->
            <el-table
              v-if="tableShow"
              :data="tableData"
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
         /*商品类型*/
         types:[],
         ajaxTypeData:[],
         /*进度条*/
         show1:true,
         show2:false,
         active: 0,
         /*品牌*/
         brandDatas:[],
         param:{
           current:1,
           size:5
         },
         /*第二页*/
         shuFrom:{
           typeId:""
         },
         attData:[],   //非sku的属性数据
         SKUData:[], //sku属性数据
         xiala:[],
         danxuan:[],
         /*笛卡尔积*/
         skuCK:[], //确定sku复选框绑定的变量名
         /*笛卡尔积表格*/
         tableShow:false,
        //表单列头信息
        cols:[],//表动态列头
         tableData:[]
       }
    },methods:{
      /*新增商品*/
      addProduct:function(){
        //商品的类型id 添加到productform
        this.value.typeId=this.shuFrom.typeId;
        console.log(this.value);
        //非sku的数据
        console.log(this.attData);
        //sku数据
        console.log(this.tableData);
        //声明后台接参的atrr
        let atrrs=[];
        for (let i = 0; i <this.attData.length ; i++) {
          let  attData={};
          attData[this.attData[i].name]=this.attData[i].ckValues;
          atrrs.push(attData)
          debugger
        }
        this.value.attr=JSON.stringify(atrrs);
        this.value.sku=JSON.stringify(this.tableData);
        //发起请求
        this.$ajax.post("http://127.0.0.1:8080/ShopController/add",this.$qs.stringify(this.value)).then(res=>{
          alert("添加成功");
        })
      },
      /*品牌*/
      queryData:function () {
        //请求数据
        var bthis = this;
        this.$ajax.post("http://127.0.0.1:8080/PinController/list", this.$qs.stringify(this.param)).then(function (rs) {
          //商品的分页数据
          bthis.brandDatas = rs.data.data.list;
        })
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
      /* 商品类型的处理相关的  */
      formaterTypeData:function(){

        this.$ajax.get("http://127.0.0.1:8080/TypeController/getData").then(res=>{

          // [{id:1,"name":"",pid:2},{}]
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
      }, //给我一个节点  得到层级name
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
        let rs=true; //标示
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
      /*图片上传*/
      imgCallBack(res, img) {
        debugger;
        //打断点 看怎么取返回值
        this.value.imgPath=res.data;
        //显示赋值
        this.imageUrl=res.data;
      },
      /*   根据typeid 查询属性数据和sku数据  */
      getAttrData:function(typeId){
       this. attData=[];
        this.  SKUData=[];
        //发起请求 拿到属性数据
        this.$ajax.get("http://127.0.0.1:8080/ShuController/queryDataByTypeId?typeId="+typeId).then(res=>{
          // 所有的属性数据
          let attrDatas=res.data.data;
          //判断分类是否有数据   更新 参数和规格
          if(attrDatas.length>0){
            //初始化  attData      SKUData
            for (let i = 0; i <attrDatas.length ; i++) {
              //判断是否为sku属性
              if(attrDatas[i].isSKU==1){
                if(attrDatas[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$ajax.get("http://127.0.0.1:8080/ShuValueController/queryAll?attId="+attrDatas[i].sid).then(res=>{
                    attrDatas[i].values=res.data.data;
                    this.attData.push(attrDatas[i]);
                  })
                }else{
                  this.attData.push(attrDatas[i]);
                }
              }else{
                if(attrDatas[i].type!=3){
                  //发起请求 查询此属性对应的选项值
                  this.$ajax.get("http://127.0.0.1:8080/ShuValueController/queryAll?attId="+attrDatas[i].sid).then(res=>{
                    attrDatas[i].values=res.data.data;
                    attrDatas[i].ckValues=[];
                    this.SKUData.push(attrDatas[i]);
                  })
                }else{
                  attrDatas[i].ckValues=[];
                  this.SKUData.push(attrDatas[i]);
                }
              }
            }
          }else{
            this.SKUData=[];
            this.attData=[];
          }

        })
        console.log(this.attData);
      },
      //监听sku属性 改变事件
      skuChange: function () {
        console.log(this.SKUData);
        //清空动态猎头
        this.cols=[];
        this.tableData=[];
        //声明笛卡尔积的参数；
        let dikaParams=[];
        //判断是否要生成笛卡尔积
        let flag = true;
        for (let i = 0; i < this.SKUData.length; i++) {
          //添加动态列头信息
          this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH,"name":this.SKUData[i].name});
          //添加笛卡尔积的参数
          dikaParams.push(this.SKUData[i].ckValues);
          //判断当前sku属性   是否被选中
          if (this.SKUData[i].ckValues.length == 0) {
            flag=false;
            break;
          }
        }
        if (flag == true) {
          alert("生成笛卡尔积");
         let res =this.calcDescartes(dikaParams);
         //遍历结果集
          for (let i = 0; i < res.length; i++) {
            //得到数据
            let valuesAttr=res[i];
            let  tableValue={};
            for (let j = 0; j <valuesAttr.length ; j++) {
              let key=this.cols[j].name;
              tableValue[key]=valuesAttr[j];
            }
            this.tableData.push(tableValue);
          }

        }
        this.tableShow=flag;

      },calcDescartes:function(array) {
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
    }, created:function () {
      this.formaterTypeData();
      this.queryData();
    }
    }
</script>

<style scoped>

</style>
