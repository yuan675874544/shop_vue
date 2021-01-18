<template>
    <div align="center">
      <h1>商品管理</h1>
      <el-card class="form-container" shadow="never">
        <el-steps  :active="active" finish-status="success" align-center>
          <el-step title="填写商品信息"></el-step>
          <el-step title="填写商品属性"></el-step>
          <el-step title="选择商品关联"></el-step>
        </el-steps>
      </el-card>
      <div style="margin-top: 50px" v-show="show1">
        <el-form :model="value"  ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
          <el-form-item label="商品分类">
            <el-select v-model="value.shopId" placeholder="请选择分类">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="value.name"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" prop="title">
            <el-input v-model="value.title"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="bandId">
            <el-select v-model="value.bandId" placeholder="请选择">
              <el-option
                v-for="item in bands"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
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
          <el-form-item label="操作人">
            <el-input v-model="value.author"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="handleNext1">下一步，填写商品促销</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="show2">
          <el-form :model="shuFrom"   label-width="120px" style="width: 600px" size="small">
            <el-form-item>
            <el-button type="primary" size="medium" @click="handleNext2">上一步</el-button>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="shuFrom.shopId" placeholder="请选择分类">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  export default {
        name: "Shop",
    data(){
       return{
         /*商品类型*/
         types:[],
         ajaxTypeData:[],
         /*进度条*/
         show1:true,
         active: 0,
         /*品牌*/
         bands:[],
         param:{
           current:1,
           size:5
         },
         /*表单*/
         value:{
           bandId:"",
         },
         /*第二页*/
         shuFrom:{}
       }
    },methods:{
      /*品牌*/
      queryData:function () {
        //请求数据
        var bthis = this;
        this.$ajax.post("http://127.0.0.1:8080/PinController/list", this.$qs.stringify(this.param)).then(function (rs) {
          //商品的分页数据
          bthis.bands = rs.data.data.list;
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
    }, created:function () {
      this.formaterTypeData();
      this.queryData();
    }
    }

</script>

<style scoped>

</style>
