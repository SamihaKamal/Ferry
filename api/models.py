from django.db import models

# Create your models here.

#USERS
class User(models.Model):
    name = models.CharField("name", max_length=100)
    #Add profile image here
    image = models.ImageField(blank=True)
    email = models.EmailField("email", unique=True)
    password = models.CharField("password", max_length=100)
    
    def __str__(self) -> str:
        return self.name
    
#TAGS
class Tag(models.Model):
    tag_text = models.CharField("tag name", max_length=100)


#POSTS AND REVIEWS
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    review_body = models.TextField(("review text"))
    # Add images here
    image = models.ImageField(blank=True)
    date = models.DateField(("date"))
    likes_counter = models.IntegerField(("likes"))
    country_tag = models.CharField(("country tag"), max_length=50, null=False)
    tags = models.ManyToManyField(Tag)
    
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    caption = models.TextField(("caption"))
    # Add images here
    image = models.ImageField(blank=True)
    date = models.DateField(("date"), null=True)
    likes_counter = models.IntegerField(("likes"))
    country_tag = models.CharField(("country tag"), max_length=50, null=True, blank=True)
    tags = models.ManyToManyField(Tag)

#COMMENTS
class Comments(models.Model):
    users = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    reviews = models.ForeignKey(Review, on_delete=models.CASCADE, null=True, blank=True)
    comment_body = models.TextField(("comment text"))
    date = models.DateField(("date"), null=True)
    likes_counter = models.IntegerField(("likes"))
    replying_to = models.ForeignKey('self', null=True, on_delete=models.CASCADE, blank=True)
    
#LISTS
class List(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(("list name"), max_length=100)
    posts = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, null=True)
    comments = models.ForeignKey(Comments, on_delete=models.CASCADE, null=True)   
    tags = models.ManyToManyField(Tag)
        

    
#CHAT AND MESSAGES
class Chat(models.Model):
    user = models.ForeignKey(User, related_name='from_user', on_delete=models.SET_NULL, null=True)
    to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.SET_NULL, null=True)
    
class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.SET_NULL, null=True)
    comment_body = models.CharField(("comment body"), max_length=250)
    to_user = models.ForeignKey(User, related_name='message_to_user', on_delete=models.SET_NULL, null=True)
    from_user = models.ForeignKey(User, related_name='message_from_user', on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(("date"))

#COUNTRY PAGE
class Country(models.Model):
    name = models.CharField(("country name"), max_length=50)
    country_tag = models.CharField(("country tag"), max_length=50, null=True)