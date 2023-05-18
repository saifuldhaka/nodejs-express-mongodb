module.exports =( mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
      {
        
        author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // author_id: String,
        title: String,
        abstract: String,
        description: String,
        published: Boolean
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    schema.plugin(mongoosePaginate);

    const Tutorial = mongoose.model("tutorial", schema);
    return Tutorial;
  };


  