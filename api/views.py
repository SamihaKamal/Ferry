import json
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from .models import *
from datetime import date, datetime
import os

#SERIALISE FUNCTIONS
#####################################################################################################################
def serialize_user(user):
    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
    }
    
def serialize_chat(chat):
    return {
        'chat_id': chat.id,
        'chat_user': serialize_user(chat.user),
        'chat_to_user': serialize_user(chat.to_user)
    }
    
def serialize_post(posts):
    return{
        'id':posts.id,
        'caption':posts.caption, 
        'date':posts.date,
        'likes':posts.likes_counter,
        'country':posts.country_tag,
        'tags': [tags.tag_text for tags in posts.tags.all()]
    }
    
def serialize_comments(comments):
    return{
        'id':comments.id,
        'posts':comments.post.id,
        'reviews':check_review_is_null(comments.reviews),
        'content':comments.comment_body,
        'date':comments.date,
        'likes':comments.likes_counter
    }
    
    


#VIEW FUNCTIONS FOR GETTING USER DATA
#####################################################################################################################
def login(request):
    '''
        Get Users and output them:
        Users:
            {
                id:
                name:
                email:
                password:  
            }
            {
                id:
                name:
                email:
                password:
            }
            
        Takes in an email and a password and looks through all the Users for match
            
    '''
    users = User.objects.all()
    users_data = [{
        'id':users.id,
        'name':users.name, 
        'image': request.build_absolute_uri(users.image.url), 
        'email':users.email, 
        'password':users.password} for users in users]
    
    if request.method == 'GET':
        return JsonResponse({
            'Users': users_data
        }, json_dumps_params={'indent':4})
        
    if request.method == 'POST':
        data = json.loads(request.body)
        userEmail = data.get('email')
        userPassword = data.get('password')
        try:
            for i in users:
                if i.email == userEmail and i.password == userPassword:
                    return JsonResponse({'message': 'User exists'}, status=200)
            return JsonResponse({'error': 'Incorrect email or password'}, status=401)
        except:
            return JsonResponse({'error': 'User does not exist'}, status=400)

def register(request):
    '''
        gets email, password and users name and then creates a new user with those details
        On account creation a default list is created
        
    '''

    
    if request.method == 'POST':
        data = json.loads(request.body)
        userEmail = data.get('email', '')
        userPassword = data.get('password', '')
        userName = data.get('name', '')

        try:
            user = User(name = userName, image='default-user.png', email = userEmail, password = userPassword)
            user.save()
            defaultList = List(name='Default', user=user)
            defaultList.save()
            return JsonResponse({'message': 'User registered, please login'}, status=200)
        except Exception as e: 
            return JsonResponse({'error': f'User already exists, please login instead: {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    

def get_user_id(request):
    '''
        Takes in user email (since thats the one thats unique) and sends back the id of the user 
        that has that email.
        
    '''
    user_email = request.GET.get('user_email', None)
    if (user_email == None):    
        return JsonResponse({'error': 'Please input ?user_email= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(email = user_email)
            return JsonResponse({'user_id': user.id}, status=200)
        except:
            return JsonResponse({'error': 'User doesnt exist'}, status=400)
        
def get_user_image(request):
    '''
        Takes in user id or email and sends back the users image.
        
    '''
    user_email=request.GET.get('user_email', None)
    user_id = request.GET.get('user_id', None)
    
    if (user_email==None) & (user_id==None):
        return JsonResponse({'error': 'Please input ?user_email= or ?user_id= to the end of the url'}, status=401)
    else:
        if (user_id):
            user = User.objects.get(id = user_id)
            image = user.image
        else:
            user = User.objects.get(email= user_email)
            image = user.image
            
    return JsonResponse({'Image': request.build_absolute_uri(image.url)}, status=200) 

def get_user_data(request):
    '''
        Takes in user id and sends back everything regarding the user.
        
    '''
    user_id=request.GET.get('user_id', None)
    
    if (user_id==None):
        return JsonResponse({'error': 'Please input ?user_id= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(id=user_id)
            users_data = {
                'id':user.id,
                'name':user.name, 
                'image': request.build_absolute_uri(user.image.url), 
                'email':user.email, 
                'password':user.password} 
            return JsonResponse({'user': users_data}, json_dumps_params={'indent':5}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'User doesnt exist {e}'}, status=400)

def get_user_by_name(request):
    '''
        Returns the user by their name.
        
    '''
    user_name=request.GET.get('user_name', None)
    
    if (user_name==None):
        return JsonResponse({'error': 'Please input ?user_name= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(name__iexact=user_name)
            users_data = {
                'id':user.id,
                'name':user.name, 
                'image': request.build_absolute_uri(user.image.url), 
                'email':user.email, 
                'password':user.password} 
            return JsonResponse({'user': users_data}, json_dumps_params={'indent':5}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'User doesnt exist {e}'}, status=400)
        
#VIEW FUNCTIONS TO EDIT USER DATA
#####################################################################################################################    

def edit_user_image(request):
    '''
        Edit the user image with their user id and the new image.
        
    '''
    if (request.method=='POST'):  
        user_id = request.POST.get('user_id', None)
        user_image = request.FILES.get('user_image', None)     
        try:
            key = User.objects.get(id=user_id)
            key.image = user_image 
            key.save()
            return JsonResponse({'message' : 'image changes successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'message':'user does not exist'}, status = 400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def edit_user_name(request):
    '''
        Edit the user image with their user id and the new name.
        
    '''
    if (request.method=='POST'):  
        user_id = request.POST.get('user_id', None)
        user_name = request.POST.get('user_name', None)     
        try:
            key = User.objects.get(id=user_id)
            key.name = user_name 
            key.save()
            return JsonResponse({'message' : 'name changes successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'message':'user does not exist'}, status = 400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
#VIEW FUNCTIONS FOR REVIEWS
#####################################################################################################################  

def get_all_reviews(request):
    '''
        Gets all posts that exists in the form:
        Reviews: [
            {
                id:
                user:{
                    id:
                    name:
                    email:
                }
                image:
                review_title:
                review_body:
                date:
                likes:
                country:
                tags: [
                    "tag1", "tag2", etc.
                ]
            }
            {
                id:
                user:{
                    id:
                    name:
                    email:
                }
                image:
                review_title:
                review_body:
                date:
                likes:
                country:
                tags: [
                    "tag1", "tag2", etc.
                ]
            }
        ]
    '''
    reviews = Review.objects.all().order_by('-id')
    reviews_data = [{
        'id':a.id,
        'user':serialize_user(a.user),
        'user_image': request.build_absolute_uri(a.user.image.url),
        'image': request.build_absolute_uri(a.image.url), 
        'review_title':a.review_title,
        'review_body':a.review_body, 
        'date':a.date,
        'likes':a.likes_counter,
        'country':a.country_tag,
        'tags': [tags.tag_text for tags in a.tags.all()]} for a in reviews]
        
    
    if request.method == 'GET':
        return JsonResponse({
            'Reviews': reviews_data
        }, json_dumps_params={'indent':5})
        
def delete_review(request):
    if (request.method == 'DELETE'):
        id = request.GET.get('id', None)
        if (id == None):
            return JsonResponse({'error': 'Please input ?id= to the end of the url'})
        else:
            review = Review.objects.get(id=id)
            review.delete()
            return JsonResponse({'message': 'post deleted'}, status=200)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
        
def create_review(request):
    '''
    
        Creates a new review using user id, captions tags and images.
        
        
    '''
    if request.method == 'POST':
        # Get all the data
        user_id = request.POST.get('user_id', None)
        text = request.POST.get('text', None)
        title = request.POST.get('title', None)
        country_tag = request.POST.get('country_tag', None)
        image = request.FILES.get('image', None)
        date_posted = date.today()

        tags = []
        for key, value in request.POST.items():
            if key.startswith('tag_'):
                tags.append(value)
        
        #Get user from the user id
        user = User.objects.get(id=user_id)
             
        #Check tags, and see if they exist, if not create a new tag
        for tag_text in tags:
            tag, created = Tag.objects.get_or_create(tag_text=tag_text)
                        
        try:
            review = Review(user = user, review_title= title, review_body = text, image = image, date= date_posted, likes_counter = 0, country_tag = country_tag)
            review.save()
            review.tags.add(*Tag.objects.filter(tag_text__in=tags))
            return JsonResponse({'message': 'Review saved'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Unable to save review: {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Incorrect request method'}, status=400)
    
def get_reviews_by_user(request):
    '''
        Takes in user id and returns every review made by that user.
        
    '''
    user_id=request.GET.get('user_id', None)
    
    if (user_id==None):
        return JsonResponse({'error': 'Please input ?user_id= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(id=user_id)
            reviews = Review.objects.all().filter(user=user)
            reviews_data = [{
                'id':a.id,
                'user':serialize_user(a.user),
                'user_image': request.build_absolute_uri(a.user.image.url),
                'image': request.build_absolute_uri(a.image.url), 
                'review_title':a.review_title,
                'review_body':a.review_body, 
                'date':a.date,
                'likes':a.likes_counter,
                'country':a.country_tag,
                'tags': [tags.tag_text for tags in a.tags.all()]} for a in reviews]
            return JsonResponse({'reviews': reviews_data}, json_dumps_params={'indent':5}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'User doesnt exist {e}'}, status=400)
 
#VIEW FUNCTIONS FOR LIKES
#####################################################################################################################    
def like(request):
    '''
        If getting likes of a post then review id is 0 else the other way is true.
        Depending which id is 0, the like is saved to the database.
        
    '''
    if (request.method=='POST'):
        data = json.loads(request.body)
        user_id = data.get('user_id', '')
        post_id = data.get('post_id', '')
        review_id = data.get('review_id', '')
        
        user = User.objects.get(id=user_id)
        
        if (post_id == ''):
            review = Review.objects.get(id = review_id)
            
            reviewLike, created = ReviewLike.objects.get_or_create(user=user, review=review)
            
            if (created == False):
                reviewLike.delete()
            
            return JsonResponse({'message': 'Liked or didnt Like, it is done'}, status=200)   
        elif (review_id == ''):
            post = Post.objects.get(id=post_id)
        
            postLike, created = PostLike.objects.get_or_create(user=user, post=post)
        
            # If there is a like already created, we delete it
            if (created == False):
                postLike.delete()
         
            return JsonResponse({'message': 'Liked or didnt Like, it is done'}, status=200)
        else:
            return JsonResponse({'error': 'Issue finding out whether its a post or a review'}, status=400)
    else:
       return JsonResponse({'error': 'Wrong request method'}, status=400) 

def get_likes(request):
    '''
        Takes in an id and a tag, the tag tells us whether the likes should be from a post or a review,
        
    '''
    if (request.method=='GET'):
        id=request.GET.get('id', None)
        tag = request.GET.get('tag', None)
        
        if (id==None) or (tag == None):
            return JsonResponse({'error': 'Please input ?id=[ID HERE]&tag= to the end of the url'}, status=401)
        else:
            if (tag == 'r'):
                count = 0
                
                review = Review.objects.get(id=id)
                reviewLikes = ReviewLike.objects.all().filter(review=review)
                reviewLikes_data = [{
                    'id':a.id,
                    'user':serialize_user(a.user)} for a in reviewLikes]
                for a in reviewLikes:
                    count = count + 1
                    
                return JsonResponse({'reviewLikes': reviewLikes_data, 'number': count}, json_dumps_params={'indent':5}, status=200)
            elif (tag == 'p'):
                count = 0
                post = Post.objects.get(id=id)
                postLikes = PostLike.objects.all().filter(post=post)
                postLikes_data = [{
                    'id':a.id,
                    'user':serialize_user(a.user)} for a in postLikes]
                for a in postLikes:
                    count = count + 1
                    
                return JsonResponse({'postLikes': postLikes_data, 'number': count}, json_dumps_params={'indent':5}, status=200)
            else:
                return JsonResponse({'error': 'Error categorising'}, status=401)
            
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)    
      
        
#VIEW FUNCTIONS FOR POSTS
#####################################################################################################################      
def get_all_post(request):
    '''
        Gets all posts that exists in the form:
        Posts: [
            {
                id:
                user:{
                    id:
                    name:
                    email:
                }
                image:
                caption:
                date:
                likes:
                country:
                tags: [
                    "tag1", "tag2", etc.
                ]
            }
            {
                id:
                user:{
                    id:
                    name:
                    email:
                }
                image:
                caption:
                date:
                likes:
                country:
                tags: [
                    "tag1", "tag2", etc.
                ]
            }
        ]
    '''
    posts = Post.objects.all().order_by('-id')
    posts_data = [{
        'id':posts.id,
        'user':serialize_user(posts.user),
        'user_image': request.build_absolute_uri(posts.user.image.url),
        'image': request.build_absolute_uri(posts.image.url), 
        'caption':posts.caption, 
        'date':posts.date,
        'likes':posts.likes_counter,
        'country':posts.country_tag,
        'tags': [tags.tag_text for tags in posts.tags.all()]} for posts in posts]
        
    
    if request.method == 'GET':
        return JsonResponse({
            'Posts': posts_data
        }, json_dumps_params={'indent':5})
        
def get_country_tags(request):
    if request.method == 'GET':
        tags = Country.objects.all()
        tags_data = [{
            'id': a.id,
            'name': a.name,
            'tag': a.country_tag,
        } for a in tags]
        
        return JsonResponse({'country': tags_data}, status=200)
    else:
       return JsonResponse({'error': 'Incorrect request method'}, status=400) 
   
def delete_post(request):
    if (request.method == 'DELETE'):
        id = request.GET.get('id', None)
        if (id == None):
            return JsonResponse({'error': 'Please input ?id= to the end of the url'})
        else:
            post = Post.objects.get(id=id)
            post.delete()
            return JsonResponse({'message': 'post deleted'}, status=200)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
    
def create_post(request):
    '''
    
        Creates a new post using user id, captions tags and images.
        
        
    '''
    if request.method == 'POST':
        # Get all the data
        user_id = request.POST.get('user_id', None)
        caption = request.POST.get('caption', None)
        country_tag = request.POST.get('country_tag', None)
        image = request.FILES.get('image', None)
        date_posted = date.today()

        tags = []
        for key, value in request.POST.items():
            if key.startswith('tag_'):
                tags.append(value)
        
        #Get user from the user id
        user = User.objects.get(id=user_id)
             
        #Check tags, and see if they exist, if not create a new tag
        for tag_text in tags:
            tag, created = Tag.objects.get_or_create(tag_text=tag_text)
                        
        try:
            if (country_tag != ''):

                post = Post(user = user, caption = caption, image = image, date= date_posted, likes_counter = 0, country_tag = country_tag)
            else:
                post = Post(user = user, caption = caption, image = image, date= date_posted, likes_counter = 0 )
            post.save()
            post.tags.add(*Tag.objects.filter(tag_text__in=tags))
            return JsonResponse({'message': 'Post saved'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Unable to save post {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Incorrect request method'}, status=400)
    
def check_review_is_null(review):
    if (review == None):
        return 0
    else:
        return review.id
    
def check_post_is_null(post):
    if (post == None):
        return 0
    else:
        return post.id
    
def get_posts_by_user(request):
    '''
        Takes in user id and returns every post made by that user.
        
    '''
    user_id=request.GET.get('user_id', None)
    
    if (user_id==None):
        return JsonResponse({'error': 'Please input ?user_id= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(id=user_id)
            posts = Post.objects.all().filter(user=user)
            posts_data = [{
                'id':posts.id,
                'user':serialize_user(posts.user),
                'image': request.build_absolute_uri(posts.image.url), 
                'user_image': request.build_absolute_uri(posts.user.image.url),
                'caption':posts.caption, 
                'date':posts.date,
                'likes':posts.likes_counter,
                'country':posts.country_tag,
                'tags': [tags.tag_text for tags in posts.tags.all()]} for posts in posts]
            return JsonResponse({'posts': posts_data}, json_dumps_params={'indent':5}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'User doesnt exist {e}'}, status=400)
    
#VIEW FUNCTIONS FOR COMMENTS
#####################################################################################################################      
def get_comment_replies(comment):
    '''
    
        Used to get comment replies before sending them back to main comment.
        
        
    '''
    replies = Comments.objects.all().filter(replying_to = comment.id)
    reply_comment_array = []
    for reply_comment in replies:
            reply ={
                'id': reply_comment.id,
                'user': serialize_user(reply_comment.users),
                'content' : reply_comment.comment_body,
                'date' : reply_comment.date,
                'likes': reply_comment.likes_counter,
                'replies' : get_comment_replies(reply_comment)
            }
            reply_comment_array.append(reply)
    
    return reply_comment_array

    
def get_comments(request):
    '''
        Getting all comments from specified post in the form:
        Comments: [
            {
                id:
                user: {
                    id:
                    name:
                    email:
                }
                posts:
                reviews:
                content:
                date:
                likes:
                replies: [
                    {
                       id:
                        user: {
                            id:
                            name:
                            email:
                        }
                        posts:
                        reviews:
                        content:
                        date:
                        likes:
                        replies: [] 
                    }
                ]
            }
        ]
    
    '''
    id = request.GET.get('id', None)
    tag = request.GET.get('tag', None)
    if (id == None) or (tag == None):    
        return JsonResponse({'error': 'Please input ?id=[]&tag= to the end of the url'}, status=401)
    else:
        comments_data = []
        if (tag == 'p'):  
            try:
                post = Post.objects.get(id=id)
                
                comments =  Comments.objects.all().filter(post = int(id), replying_to__isnull=True).order_by(f'-date')
                comments_data = [{
                    'id':comments.id,
                    'user':serialize_user(comments.users),
                    'posts':comments.post.id,
                    'reviews':check_review_is_null(comments.reviews),
                    'content':comments.comment_body,
                    'date':comments.date,
                    'likes':comments.likes_counter,
                    'replies':get_comment_replies(comments)} for comments in comments]  
            except Exception as e:
                return JsonResponse({'error': f'Cannot get post comments: {e}'}, status=400)
        elif (tag == 'r'):
            try:
                review = Review.objects.get(id=id)
                
                comments =  Comments.objects.all().filter(reviews = int(id), replying_to__isnull=True).order_by(f'-date')
                comments_data = [{
                    'id':comments.id,
                    'user':serialize_user(comments.users),
                    'posts':check_post_is_null(comments.post),
                    'reviews':comments.reviews.id,
                    'content':comments.comment_body,
                    'date':comments.date,
                    'likes':comments.likes_counter,
                    'replies':get_comment_replies(comments)} for comments in comments]
            except Exception as e:
                return JsonResponse({'error': f'Cannot get review comments: {e}'}, status=400)
            
    return JsonResponse({
            'Comments': comments_data
        }, json_dumps_params={'indent':5})
    
def create_comment(request):
    '''
        
        Creating a comment with userId, postId, body of comment and date.
    
    '''
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id', '')
        post_id = data.get('post_id', '')
        review_id = data.get('review_id', '')
        comment_body = data.get('comment_body', '')
        comment_date = date.today()
    
        user = User.objects.get(id=user_id)
        if (review_id == 0):

            post = Post.objects.get(id=post_id)
            try:
                comment = Comments(users=user, post=post, comment_body=comment_body, date=comment_date, likes_counter=0)
                comment.save()
                return JsonResponse({'message': 'Comment saved'}, status=200)
            except Exception as e: 
                return JsonResponse({'error': f'Error creating comment {e}'}, status=401)
        elif (post_id == 0):
            
            review = Review.objects.get(id=review_id)
            try:
                
                comment = Comments(users=user, reviews=review, comment_body=comment_body, date=comment_date, likes_counter=0)

                comment.save()
                return JsonResponse({'message': 'Comment saved'}, status=200)
            except Exception as e: 
                return JsonResponse({'error': f'Error creating comment {e}'}, status=401)
        else:
            return JsonResponse({'error': 'Error categorising'}, status=401)
        
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
    
def create_reply_comment(request):
    '''
    
        Creating a reply comment but adding the reply comment id too.
    
    '''
    if request.method == 'POST':
        data = json.loads(request.body)
        comment_id = data.get('comment_id', '')
        user_id = data.get('user_id', '')
        post_id = data.get('post_id', '')
        review_id = data.get('review_id', '')
        comment_body = data.get('comment_body', '')
        comment_date = date.today()

        user = User.objects.get(id=user_id)
        reply_to_comment = Comments.objects.get(id=comment_id)
        
        if (review_id == 0):
            post = Post.objects.get(id=post_id)
            try:
                comment = Comments(users=user, post=post, comment_body=comment_body, date=comment_date, likes_counter=0, replying_to=reply_to_comment)
                comment.save()
                return JsonResponse({'message': 'Comment saved'}, status=200)
            except Exception as e: 
                return JsonResponse({'error': f'Error creating comment {e}'}, status=401)
        elif (post_id == 0):
            review = Review.objects.get(id=review_id)
            try:
                comment = Comments(users=user, reviews=review, comment_body=comment_body, date=comment_date, likes_counter=0, replying_to=reply_to_comment)
                comment.save()
                return JsonResponse({'message': 'Comment saved'}, status=200)
            except Exception as e: 
                return JsonResponse({'error': f'Error creating comment {e}'}, status=401)
        else:
            return JsonResponse({'error': 'Error categorising '}, status=401)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
  
        
def get_comments_by_user(request):
    '''
        Takes in user id and returns every comment made by that user.
        
    '''
    user_id=request.GET.get('user_id', None)
    
    if (user_id==None):
        return JsonResponse({'error': 'Please input ?user_id= to the end of the url'}, status=401)
    else:
        try:
            user = User.objects.get(id=int(user_id))
            comments = Comments.objects.all().filter(users=user)
            comments_data = [{
                'id':a.id,
                'user':serialize_user(a.users),
                'posts':check_post_is_null(a.post),
                'reviews':check_review_is_null(a.reviews),
                'content':a.comment_body,
                'date':a.date,
                'likes':a.likes_counter} for a in comments]
            return JsonResponse({'comments': comments_data}, json_dumps_params={'indent':5}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'User doesnt exist {e}'}, status=400)

def get_item_by_id(request):
    '''
    
        Takes an id and a flag, and based off the flag it returns a post or review.
        
        
    '''
    if (request.method == 'GET'):
        id = request.GET.get('id', None)
        flag = request.GET.get('flag', None)
        
        if (id==None) or (flag==None):
            return JsonResponse({'error': 'Please input ?id=[]&flag= to the end of the url'}, status = 400)
        else:
            if (flag == 'r'):
                review = Review.objects.get(id = id)
                review_data = {
                    'id': review.id,
                    'user':serialize_user(review.user),
                    'user_image': request.build_absolute_uri(review.user.image.url),
                    'image': request.build_absolute_uri(review.image.url), 
                    'review_title':review.review_title,
                    'review_body':review.review_body, 
                    'date':review.date,
                    'likes':review.likes_counter,
                    'country':review.country_tag,
                    'tags': [tags.tag_text for tags in review.tags.all()]
                }
                
                return JsonResponse({'review': review_data}, status=200)
            elif (flag == 'p'):
                post = Post.objects.get(id = id)
                post_data = {
                    'id':post.id,
                    'user':serialize_user(post.user),
                    'user_image': request.build_absolute_uri(post.user.image.url),
                    'image': request.build_absolute_uri(post.image.url), 
                    'caption':post.caption, 
                    'date':post.date,
                    'likes':post.likes_counter,
                    'country':post.country_tag,
                    'tags': [tags.tag_text for tags in post.tags.all()]
                }
                
                return JsonResponse({'post': post_data}, status=200)
            elif (flag == 'c'):
                comment = Comments.objects.get(id = id)
                if (comment.post != None):
                    post = comment.post
                    post_data = {
                    'id':post.id,
                    'user':serialize_user(post.user),
                    'user_image': request.build_absolute_uri(post.user.image.url),
                    'image': request.build_absolute_uri(post.image.url), 
                    'caption':post.caption, 
                    'date':post.date,
                    'likes':post.likes_counter,
                    'country':post.country_tag,
                    'flag': 'p',
                    'tags': [tags.tag_text for tags in post.tags.all()]
                    }
                    return JsonResponse({'post': post_data}, status=200)
                else:
                    review = comment.reviews 
                    review_data = {
                        'id': review.id,
                        'user':serialize_user(review.user),
                        'user_image': request.build_absolute_uri(review.user.image.url),
                        'image': request.build_absolute_uri(review.image.url), 
                        'review_title':review.review_title,
                        'review_body':review.review_body, 
                        'date':review.date,
                        'likes':review.likes_counter,
                        'country':review.country_tag,
                        'flag': 'r',
                        'tags': [tags.tag_text for tags in review.tags.all()]
                    }
                    
                    return JsonResponse({'review': review_data}, status=200)   
            else:
                return JsonResponse({'error': 'unable to discern flag'}, status=400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
      
#VIEW FUNCTIONS FOR CHAT
#####################################################################################################################  


def create_chat(request):
    '''
        Creates a new chat by checking if one already exists with the user and then creating one.
        
    '''
    if (request.method=='POST'):
        data = json.loads(request.body)   
        user_id = data.get('user_id','')
        receiver_id = data.get('to_user_id','')
        
        user = User.objects.get(id=user_id)
        reciever = User.objects.get(id=receiver_id)
        
        all_chats = Chat.objects.all()
        try:
            for a in all_chats:
                if (a.to_user==user and a.user==reciever):
                    return JsonResponse({'message':'chat exists'}, status=200)        
            chat, created = Chat.objects.get_or_create(user=user, to_user=reciever) 
            return JsonResponse({'message': 'new chat created', 'chat': chat.id}, safe=False, status=200) 
        except Exception as e: 
            return JsonResponse({'error': f'something went wrong: {e}'}, status=400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_user_chats(request):
    '''
        Returns all chat.
        
    '''
    if (request.method=='GET'):
        user_id=request.GET.get('user_id', None)
        
        if (user_id==None):
            return JsonResponse({'error': 'Please input ?user_id= to the end of the url'}, status=401)
        else:
            try:
                user = User.objects.get(id=user_id)
                chats = Chat.objects.all().filter(user=user)
                chats_data = [{
                    'id': chats.id,
                    'user': serialize_user(chats.user),
                    'user_image':  request.build_absolute_uri(chats.user.image.url),
                    'to_user': serialize_user(chats.to_user),
                    'to_user_image': request.build_absolute_uri(chats.to_user.image.url),} for chats in chats]
                
                to_user_chats = Chat.objects.all().filter(to_user=user)
                to_user_chats_data = [{
                    'id': chats.id,
                    'user': serialize_user(chats.to_user),
                    'user_image':  request.build_absolute_uri(chats.to_user.image.url),
                    'to_user': serialize_user(chats.user),
                    'to_user_image': request.build_absolute_uri(chats.user.image.url),} for chats in to_user_chats]
                
                all_chats = []
                if (chats_data != []):
                    all_chats.append(chats_data)
                if (to_user_chats_data != []):
                    all_chats.append(to_user_chats_data)
                
                return JsonResponse({'chats': all_chats}, json_dumps_params={'indent':5}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Chat doesnt exist:  {e}'}, status=400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
def get_messages_from_chat(request):
    '''
        Returns all messages made in a specific chat.
        
    '''
    if (request.method=='GET'):
        chat_id = request.GET.get('chat_id', None)
        
        if (chat_id == None):
            return JsonResponse({'error': 'Please input ?chat_id= to the end of the url'}, status=401)
        else:
            try:
                chat = Chat.objects.get(id=chat_id)
                
                Chat_messages = Message.objects.all().filter(chat=chat)
                chat_data =[{
                    'id': a.id,
                    'chat': serialize_chat(a.chat),
                    'content': a.comment_body,
                    'sender': serialize_user(a.from_user),
                    'receiver': serialize_user(a.to_user),
                    'date': a.date
                    } for a in Chat_messages]
                return JsonResponse({'messages': chat_data}, json_dumps_params={'indent':5}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'messages doesnt exist:  {e}'}, status=400)         
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def create_message(request):
    '''
        Creates a new message.
        
    '''
    if (request.method=='POST'):
        
        data = json.loads(request.body)
        user_id = data.get('user_id','')
        receiver_id = data.get('to_user_id','')
        chat_id = data.get('chat_id','')
        content = data.get('content','')
        date = datetime.now()
        
        sender = User.objects.get(id=user_id)
        receiver =  User.objects.get(id=receiver_id)
        chat = Chat.objects.get(id=chat_id)
        
        try:
            new_message = Message(chat=chat, comment_body=content, from_user=sender, to_user=receiver, date=date)
            new_message.save()
            return JsonResponse({'message': 'message saved'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Unable to save message: {e}'}, status=401)
        
        
    else:
      return JsonResponse({'error': 'Wrong request method'}, status=400)  
  
  
#VIEW FUNCTIONS FOR COUNTRY PAGES
#####################################################################################################################  
def get_countries(request):
    '''
        Gets countrys and lays them out as:
        countries: [
            {
                id:
                name:
                tag:
            }
            {
                id:
                name:
                tag:
            }
        ]
    
    '''
    if (request.method == 'GET'):
        countries = Country.objects.all()
        countries_data = [{
            'id': a.id,
            'name': a.name,
            'tag': a.country_tag} for a in countries]
        return JsonResponse({'countries': countries_data}, json_dumps_params={'indent':5}, status=200)
    else: 
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_country_from_id(request):
    '''
        Returns a country from a specific country id.

    '''
    if (request.method == 'GET'):
        country_id = request.GET.get('country_id', None)
        
        if (country_id == None):
            return JsonResponse({'error': 'Please input ?country_id= to the end of the url'}, status=401)
        else:
            country = Country.objects.get(id=country_id)
            country_data ={
                'id': country.id,
                'name': country.name,
                'tag': country.country_tag,
            }
            return JsonResponse({'country': country_data}, json_dumps_params={'indent':5}, status=200)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_posts_from_country(request):
    '''
        Returns post that have country tags that are the same.

    '''
    if (request.method=='GET'):
        country_id = request.GET.get('country_id', None)
        
        if (country_id == None):
            return JsonResponse({'error': 'Please input ?country_id= to the end of the url'}, status=401)
        else:
            country = Country.objects.get(id=country_id)
            posts = Post.objects.all().filter(country_tag=country.country_tag)
            posts_data = [{
                'id':posts.id,
                'user':serialize_user(posts.user),
                'user_image': request.build_absolute_uri(posts.user.image.url),
                'image': request.build_absolute_uri(posts.image.url), 
                'caption':posts.caption, 
                'date':posts.date,
                'likes':posts.likes_counter,
                'country':posts.country_tag,
                'tags': [tags.tag_text for tags in posts.tags.all()]} for posts in posts]
            return JsonResponse({'posts': posts_data}, json_dumps_params={'indent':5}, status=200)   
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_reviews_from_country(request):
    '''
        Returns reviews that have a country tags that are the same.
        
    '''
    if (request.method=='GET'):
        country_id = request.GET.get('country_id', None)
        
        if (country_id == None):
            return JsonResponse({'error': 'Please input ?country_id= to the end of the url'}, status=401)
        else:
            country = Country.objects.get(id=country_id)
            reviews = Review.objects.all().filter(country_tag=country.country_tag)
            reviews_data = [{
                'id':a.id,
                'user':serialize_user(a.user),
                'user_image': request.build_absolute_uri(a.user.image.url),
                'image': request.build_absolute_uri(a.image.url), 
                'review_title':a.review_title,
                'review_body':a.review_body, 
                'date':a.date,
                'likes':a.likes_counter,
                'country':a.country_tag,
                'tags': [tags.tag_text for tags in a.tags.all()]} for a in reviews]
            return JsonResponse({'reviews': reviews_data}, json_dumps_params={'indent':5}, status=200)   
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_country_image(request):
    '''
        Returns images from posts that are have the specified country tag.
    
    '''
    if (request.method=='GET'):
        country_id = request.GET.get('country_id', None)
        
        if (country_id == None):
            return JsonResponse({'error': 'Please input ?country_id= to the end of the url'}, status=401)
        else:
            country = Country.objects.get(id=country_id)
            posts = Post.objects.all().filter(country_tag=country.country_tag)
            posts_data = [{
                'id':posts.id,
                'user':serialize_user(posts.user),
                'image': request.build_absolute_uri(posts.image.url)} for posts in posts]
            return JsonResponse({'posts': posts_data}, json_dumps_params={'indent':5}, status=200)   
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
               
#VIEW FUNCTIONS FOR LISTS
#####################################################################################################################     
def get_user_lists(request):
    '''
        Takes a user id and then returns all the lists under that user.
        
    '''
    if (request.method=='GET'):
        user_id = request.GET.get('user_id', None)
        
        if (user_id == None):
            return JsonResponse({'error': 'Please input ?user_id= to the end of the url'})
        else:
            try:
                user = User.objects.get(id = user_id)
                user_lists = List.objects.all().filter(user=user)
            
                lists_data = [{
                    'id': a.id,
                    'name': a.name,
                    'user': serialize_user(a.user),
                    'user_image': request.build_absolute_uri(a.user.image.url),
                    'posts': [check_post_is_null(posts) for posts in a.posts.all()],
                    'comments': [comments.id for comments in a.comments.all()],
                    'tags': [tags.tag_text for tags in a.tags.all()]} for a in user_lists]
                return JsonResponse({'lists': lists_data}, json_dumps_params={'indent':5}, status=200)
            except Exception as e:
               return JsonResponse({'error': f'Unable to get posts: {e}'}, status=401) 
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def save_to_list(request):
    '''
        Saves an item to a list using user id and the list id, it saves the post or review that does not have an id of 0.
        
    '''
    if (request.method == 'POST'):
        data = json.loads(request.body)
        user_id = data.get('user_id', '')
        list_id = data.get('list_id', '')
        posts_id = data.get('posts_id', '')
        review_id = data.get('review_id', '')
        
        user = User.objects.get(id=user_id)
        list = List.objects.get(id=list_id)

        if (posts_id == 0):
            review = Review.objects.get(id=review_id)
            list.review.add(review)
            return JsonResponse({'message': 'Review succesfully added to list!'}, status=200)
        elif (review_id == 0):
            post = Post.objects.get(id=posts_id)
            list.posts.add(post)
            return JsonResponse({'message': 'Post succesfully added to list!'}, status=200)
        else:
            return JsonResponse({'error': 'Issue trying to do something'}, status=200)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
   
def save_comment_to_list(request):
    '''
        Saves a comment to the list using the user id, the list id and the id of the comment.
        
    '''
    if (request.method == 'POST'):
        data = json.loads(request.body)
        user_id = data.get('user_id', '')
        list_id = data.get('list_id', '')
        comment_id = data.get('comment_id', '')
        
        user = User.objects.get(id=user_id)
        comment = Comments.objects.get(id=comment_id)
        list = List.objects.get(id=list_id)
        
        try:
            list.comments.add(comment)
            return JsonResponse({'message': 'Post succesfully added to list!'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Unable to save post to list: {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_list_posts(request):
    '''
        Returns all posts that are saved to a specific list.
        
    '''
    if (request.method=='GET'):
        list_id = request.GET.get('list_id', None)
        
        if (list_id == None):
            return JsonResponse({'error': 'Please input ?list_id= to the end of the url'})
        else:
            try:
                list = List.objects.get(id = list_id) 
                list_posts = list.posts.all()
                posts_data = [{
                'id':posts.id,
                'user':serialize_user(posts.user),
                'user_image': request.build_absolute_uri(posts.user.image.url),
                'image': request.build_absolute_uri(posts.image.url), 
                'caption':posts.caption, 
                'date':posts.date,
                'likes':posts.likes_counter,
                'country':posts.country_tag,
                'tags': [tags.tag_text for tags in posts.tags.all()]} for posts in list_posts]
                
                return JsonResponse({'posts': posts_data}, json_dumps_params={'indent':5}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Unable to save post to list: {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
def get_list_reviews(request):
    '''
        Returns all reviews that are saved to a specific list.
        
    '''
    if (request.method == 'GET'):
        list_id = request.GET.get('list_id', None)
        if (list_id == None):
            return JsonResponse({'error': 'Please input ?list_id= to the end of the url'})
        else:
            try:
                list = List.objects.get(id = list_id)
                list_reviews = list.review.all()
                
                reviews_data = [{
                    'id': a.id,
                    'user':serialize_user(a.user),
                    'user_image': request.build_absolute_uri(a.user.image.url),
                    'image': request.build_absolute_uri(a.image.url), 
                    'review_title':a.review_title,
                    'review_body':a.review_body, 
                    'date':a.date,
                    'likes':a.likes_counter,
                    'country':a.country_tag,
                    'tags': [tags.tag_text for tags in a.tags.all()]} for a in list_reviews]
                
                return JsonResponse({'reviews': reviews_data}, json_dumps_params={'indent': 5}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Unable to get reviews data: {e}'}, status=400)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def get_list_comments(request):
    '''
        Returns all comments that are saved to a specific list.
        
    '''
    if (request.method=='GET'):
        list_id = request.GET.get('list_id', None)
        
        if (list_id == None):
            return JsonResponse({'error': 'Please input ?list_id= to the end of the url'})
        else:
            try:
                list = List.objects.get(id = list_id) 
                list_comments = list.comments.all()
                comments_data = [{
                'id':comments.id,
                'user':serialize_user(comments.users),
                'posts':check_post_is_null(comments.post),
                'user_image':request.build_absolute_uri(comments.users.image.url),
                'reviews':check_review_is_null(comments.reviews),
                'content':comments.comment_body,
                'date':comments.date,
                'likes':comments.likes_counter} for comments in list_comments]
                
                return JsonResponse({'comments': comments_data}, json_dumps_params={'indent':5}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Unable to save post to list: {e}'}, status=401)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
def get_list(request):
    '''
        Gets a list based of the id that is received.
        
    '''
    if (request.method=='GET'):
        list_id = request.GET.get('list_id', None)
        
        if (list_id == None):
            return JsonResponse({'error': 'Please input ?list_id= to the end of the url'})
        else:
            list = List.objects.get(id=list_id)
            list_data = {
               'id': list_id,
               'user': serialize_user(list.user),
               'name': list.name,
               'tags': [tags.tag_text for tags in list.tags.all()]
            }
            return JsonResponse({'list': list_data})
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
    
def create_list(request):
    '''
        Creates a list based off the user id and the name that was entered by the user.
        
    '''
    if (request.method == 'POST'):
        
        user_id = request.POST.get('user_id', None)
        name = request.POST.get('name', None)   
        
        tags = []
        for key, value in request.POST.items():
            if key.startswith('tag_'):
                tags.append(value)
        
        #Get user from the user id
        user = User.objects.get(id=user_id)
             
        #Check tags, and see if they exist, if not create a new tag
        for tag_text in tags:
            tag, created = Tag.objects.get_or_create(tag_text=tag_text)
                        
        try:
            list = List(user = user, name = name)
            list.save()
            list.tags.add(*Tag.objects.filter(tag_text__in=tags))
            return JsonResponse({'message': 'List created'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Unable to create list {e}'}, status=401)
        
    else: 
        return JsonResponse({'error': 'Wrong request method'}, status=400)
    
def delete_list(request):
    '''
        Deletes a list based off the id.
        
    '''
    if (request.method == 'DELETE'):
        list_id = request.GET.get('list_id', None)
        if (list_id == None):
            return JsonResponse({'error': 'Please input ?list_id= to the end of the url'})
        else:
            list = List.objects.get(id=list_id)
            list.delete()
            return JsonResponse({'message': 'list deleted'}, status=200)
    else:
        return JsonResponse({'error': 'Wrong request method'}, status=400) 
        
        

