<template>
  <div>
    <h1>商品分类管理</h1>
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion

    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
  <span>{{ node.label }}</span>
  <span>
    <el-button
      type="text"
      size="mini"
@click="() => addForms( data)">
      新增
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="() => remove(node, data)">
      删除
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="() => update(data)">
      修改
    </el-button>
  </span>
</span>

    </el-tree>
    <!--新增的弹框-->
    <el-dialog title="录入商品信息" :visible.sync="addFormFlag">
        <el-form ref="addShopForm" :model="addShopForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addShopForm.name" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改的弹框-->
    <el-dialog title="修改商品信息" :visible.sync="UpdateFormFlag">
      <el-form ref="UpdateShopForm" :model="UpdateShopForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="UpdateShopForm.name" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdateFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="UpdateForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  export default {
    name: "Type",
    data(){
      return{
        data:[],//tree 的数据
        ajaxData:[],// 远程请求的数据
        jsonStr:"", //递归拼接处理
        defaultProps:{},
        //新增节点的数据
        addFormFlag:false,
        addShopForm:{
          name:"",
          pid:"",
        }
        ,//修改节点的数据
        UpdateFormFlag:false,
        UpdateShopForm:{
          name:""
        }
      }
    }
    ,methods:{
      update:function(data){
        var uthis=this;
        this.UpdateFormFlag=true;
        this.$ajax.get("http://127.0.0.1:8080/TypeController/getDataByid?id=" +data.id).then(function (res) {
          debugger
          var updateData = res.data.data
          uthis.UpdateShopForm.id=updateData.id;
          uthis.UpdateShopForm.name=updateData.name;
        })
      },
      UpdateForm:function(){
        //发起请求
        var uthis=this;
        this.$ajax.post("http://127.0.0.1:8080/TypeController/update", this.$qs.stringify(this.UpdateShopForm)).then(function () {
          //关闭弹框
          alert("修改成功")
          uthis.UpdateFormFlag = false;
          location.reload();
        })
      },
      addForms:function (data) {
          this. addFormFlag=true;
          this.addShopForm.pid=data.id

      },
      addForm:function(){
        var athis=this;
        //发起请求
        this.$ajax.post("http://127.0.0.1:8080/TypeController/add", this.$qs.stringify(this.addShopForm)).then(function () {
          //关闭弹框
          alert("新增成功")
          athis.addFormFlag = false;
          location.reload();
        })
      },
      chandleData:function(){ //ajaxData  处理成 data   //转换数据
        debugger;
        //找到顶层节点的数据
        for (let i = 0; i <this.ajaxData.length ; i++) {
          if(this.ajaxData[i].pid==0){
            this.diguiNode(this.ajaxData[i]);
            break;
          }
        }
        console.log(this.jsonStr);
        //将字符串 转为json对象
        this.data.push(JSON.parse(this.jsonStr));

      },  //  id  name  pid        id  name children []
      diguiNode:function (node) {
        // 判断是否为父节点
        var bf=this.isParent(node);
        if(bf==true){
          //{"id":1,"label":"分类",}
          //{"id":1,"label":"分类","children":[]}
          this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
          //拼接子节点
          //查找此节点的子节点
          let count=0
          for (let i = 0; i <this.ajaxData.length ; i++) {
            //判断是否为当前节点的子节点
            if(node.id==this.ajaxData[i].pid){
              count++;
              this.diguiNode(this.ajaxData[i]);
              this.jsonStr+=",";
            }
          }
          //处理多余的,号
          if(count!=0){
            this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
          }



          //拼完整
          this.jsonStr+=']}';
        }else{
          this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';
        }

      }
      ,isParent:function(node){ // 判断是否为父节点  pid 有没有指向当前id

        for (let i = 0; i <this.ajaxData.length ; i++) {
          if(node.id==this.ajaxData[i].pid){
            return true;
          }
        }
        return false;
      },
  remove(node, data) {
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let tthis=this;
      if(node.childNodes.length==""){
        this.$ajax.post("http://127.0.0.1:8080/TypeController/update?id="+data.id+"&isDel="+1+"").then(res=>{
          // 把请求的数据  赋给全局
          tthis.$message({
            type: 'success',
            message: '删除成功!'
          });
          location.reload();
          console.log(res)
        }).catch(err=>console.log(err));
      }else
      {
        tthis.$message({
          type: 'warning',
          message: '分级下面有内容,不准删除!'
        });
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });
  }


  }
    ,created:function(){
      //远程请求数据
      this.$ajax.get("http://127.0.0.1:8080/TypeController/getData").then(res=>{
        this.ajaxData=res.data.data.data;  // 把请求的数据  赋给全局
        this.chandleData();
      }).catch(err=>console.log(err));
    },
  }
</script>

<style scoped>

</style>
