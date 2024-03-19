const express=require("express");
const mongoose=require("mongoose");
const app=express();
mongoose.connect('mongodb+srv://yash2003:yash2103@yash.p71t17t.mongodb.net/expensesDB', {useNewUrlParser: true});
app.use(express.json());

const expenseSchema=new mongoose.Schema({
  type:{
    type:String,
    required:[true,"type is required"],
  },
  expense:{
    type:Number,
    required:[true,"cannot leave expenses blank"]
  }
})

const expenses=mongoose.model("expenses",expenseSchema);

//get all the expenses
app.get("/expenses",(req,res)=>{
  expenses.find({}).then(
    function(getExpense){
      console.log(getExpense);
      res.json(getExpense)
    }
  ).catch((err)=>console.log(err));
});

//get one expense filtered by type of expense
app.get("/expenses/:type",(req,res)=>{
  const type=req.params.type;
  expenses.findOne({type:type}).then(
    function(getExpense){
      if(getExpense==null){
        res.json({error:"no such type of expense"})
      }
      else{
        console.log(getExpense);
        res.json(getExpense)
      }
    }
  ).catch((err)=>console.log(err));
});

//get sum of all the expenses in the database
app.get("/expenses/sum",(req,res)=>{
  expenses.find({}).then(
    function(getExpense){
      let totalExpense=0;
      getExpense.forEach(function(expenseSum){
        totalExpense=totalExpense+expenseSum.expense;
      });
      console.log(totalExpense);
      res.json({"Total Expense":totalExpense});
    }
  ).catch((err)=>console.log(err));
});

//create new expenses
app.post("/expenses/create",async (req,res)=>{
  try{
    const addExpense=await expenses.create(req.body);
    console.log("Expense added");
    res.json(addExpense);
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
});

// update one record in existing expenses
app.patch("/expenses/update/:type",async (req,res)=>{
  try{
    const type=req.params.type;
    const updateExpense=await expenses.findOneAndUpdate({type:type},{expense:req.body.expense});
    if(updateExpense===null){
      res.json({error:"no such type of expense"});
    }
    else{
      console.log(updateExpense);
      res.json({message:"updated successfully"});
    }
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
});

//delete an expense
app.delete("/expenses/delete/:type",async (req,res)=>{
  try{
    const type=req.params.type;
    const deleteExpense=await expenses.findOneAndDelete({type:type});
    if(deleteExpense===null){
      res.json({error:"no such type of expense"});
    }
    else{
      console.log(deleteExpense);
      res.json({message:"deleted successfully"});
    }
    
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
});

app.listen(3000,()=>{
  console.log("server is running on 3000");
});
