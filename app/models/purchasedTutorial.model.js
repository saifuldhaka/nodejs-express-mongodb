module.exports =( mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
      {
        // user_id: String,        
        // tutorial_id: String
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tutorial_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    schema.plugin(mongoosePaginate);

    const PurchasedTutorial = mongoose.model("purchasedTutorial", schema);
    return PurchasedTutorial;
  };