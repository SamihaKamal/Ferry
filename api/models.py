from django.db import models

# Create your models here.

#USERS
class User(models.Model):
    name = models.CharField("name", max_length=100)
    email = models.EmailField("email", unique=True)
    password = models.CharField("password", max_length=100)
    
    def __str__(self) -> str:
        return self.name

#COMMENTS
class Comments(models.Model):
    users = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment_body = models.TextField(("comment text"))
    date = models.DateField(("date"))
    likes_counter = models.IntegerField(("likes"))
    replying_to = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
    

#POSTS AND REVIEWS
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    review_body = models.models.models.TextField(("review text"))
    # Add images here
    comments = models.ForeignKey(Comments, on_delete=models.CASCADE, null=True)
    likes_counter = models.IntegerField(("likes"))
    country_tag = models.CharField(("country tag"), max_length=50, null=False)
    
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    caption = models.models.models.TextField(("caption"))
    # Add images here
    comments = models.ForeignKey(Comments, on_delete=models.CASCADE, null=True)
    likes_counter = models.IntegerField(("likes"))
    country_tag = models.CharField(("country tag"), max_length=50, null=True)
    
#LISTS
class List(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(("list name"), max_length=100)
    posts = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, null=True)
    comments = models.ForeignKey(Comments, on_delete=models.CASCADE, null=True)   
        
#TAGS
class Tag(models.Model):
    tag_text = models.CharField("tag name", max_length=100)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, null=True)
    lists = models.ForeignKey(List, on_delete=models.CASCADE, null=True)
    
#CHAT AND MESSAGES
class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    to_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.SET_NULL, null=True)
    comment_body = models.CharField(("comment body"), max_length=250)
    to_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    from_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(("date"))

#COUNTRY PAGE
class Country(models.Model):
    name = models.CharField(("country name"), max_lenth=50)
    country_tag = models.CharField(("country tag"), max_length=50, null=True)