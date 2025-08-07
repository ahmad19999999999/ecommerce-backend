export default (handelfunction)=>(req,res,next)=>{
    Promise.resolve(handelfunction(req,res,next)).catch(next);

}