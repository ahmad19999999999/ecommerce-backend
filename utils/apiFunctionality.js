class apiFunctionality{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }
    search(){
     
        const keyword = this.querystr.keyword
            ? {
                  name: {
                      $regex: this.querystr.keyword,
                      $options: "i", // case-insensitive
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }
filter() {
  let queryCopy = { ...this.querystr };

  // الحقول التي ليست للفلترة
  const removeFields = ["keyword", "page", "limit", "sort"];
  removeFields.forEach((key) => delete queryCopy[key]);

  // **تحويل المفاتيح مع الأقواس [] إلى كائنات**
  const newQuery = {};
  for (let key in queryCopy) {
    if (key.includes('[')) {
      const [field, operator] = key.split(/\[|\]/).filter(Boolean); // price, lte
      if (!newQuery[field]) newQuery[field] = {};
      newQuery[field][operator] = queryCopy[key];
    } else {
      newQuery[key] = queryCopy[key];
    }
  }
  queryCopy = newQuery;

  // دعم عوامل المقارنة
  let queryStr = JSON.stringify(queryCopy);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const parsedQuery = JSON.parse(queryStr);

  // تحويل price إلى رقم
  if (parsedQuery.price) {
    Object.keys(parsedQuery.price).forEach((key) => {
      parsedQuery.price[key] = Number(parsedQuery.price[key]);
    });
  }

 // console.log("Final Filter:", parsedQuery); // Debug

  this.query = this.query.find(parsedQuery);
  return this;
}


pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
}



    
}

export default apiFunctionality;