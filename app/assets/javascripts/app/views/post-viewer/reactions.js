app.views.PostViewerReactions = app.views.Base.extend({

  className : "",

  templateName: "post-viewer/reactions",

  tooltipSelector : ".avatar",

  subviews : {
    '.posts-comments-container' : 'commentView'
  },

  initialize : function(){
    this.commentView = new app.views.PostViewerComments({model : this.model})
  },


  presenter : function(){
    return {
      post_id : this.model.post.id,
      likes : this.model.likes.toJSON(),
      comments : this.model.comments.toJSON(),
      remixes : this.model.remixes.toJSON()
    }
  },


});

app.views.PostViewerComments = app.views.Base.extend({
  templateName : 'post-viewer-comments',
  initialize : function() {
    this.model.on('change', this.render, this);
    this.model.comments.on("add", this.appendComment, this)
  },

  unbind : function(){
    this.model.off("change", this.render, this)
    this.model.comments.off("add", this.appendComment, this)
  },

  postRenderTemplate : function() {
    this.populateComments()
  },

  /* copy pasta from commentStream */
  populateComments : function() {
    this.model.comments.each(this.appendComment, this)
  },

  /* copy pasta from commentStream */
  appendComment: function(comment) {
    // Set the post as the comment's parent, so we can check on post ownership in the Comment view.
    // model was post on old view, is interactions on new view
    var parent = this.model.get("post_type") ? this.model.toJSON : this.model.post.toJSON()

    comment.set({parent : parent})
    
    this.$("#post-comments").append(new app.views.Comment({
      model: comment,
      className : "post-comment media",
      templateName : "post-viewer/comment"
    }).render().el);
  }
});
