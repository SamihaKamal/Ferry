import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from datetime import date

# Create your views here.


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
        
    '''
    if request.method == 'POST':
        data = json.loads(request.body)
        userEmail = data.get('email', '')
        userPassword = data.get('password', '')
        userName = data.get('name', '')

        try:
            user = User(name = userName, email = userEmail, password = userPassword)
            user.save()
            return JsonResponse({'message': 'User registered, please login'}, status=200)
        except: 
            return JsonResponse({'error': 'User already exists, please login instead'}, status=401)
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
        
        
#VIEW FUNCTIONS FOR POSTS
#####################################################################################################################        
def serialize_user(user):
    return {
        'id': user.id,
        'name': user.name,
        'email': user.email
    }

def get_all_post(request):
    posts = Post.objects.all()
    posts_data = [{
        'id':posts.id,
        'user':serialize_user(posts.user),
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
        

def create_post(request):
    
    if request.method == 'POST':
        # Get all the data
        user_id = request.POST.get('user_id', None)
        caption = request.POST.get('caption', None)
        tags_string = request.POST.get('tag')
        image = request.FILES.get('image', None)
        date_posted = date.today()
        
        print(date_posted)
        print(image)
        print(tags_string)
        
        tags = [tag.strip() for tag in tags_string.split(',')]
        
        #Get user from the user id
        user = User.objects.get(id=user_id)
        current_tags = Tag.objects.all()
        found = False
        
        #Check tags, and see if they exist, if not create a new tag
        for tag_text in tags:
            tag, created = Tag.objects.get_or_create(tag_text=tag_text)
                    
        try:
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
    
def get_comment_replies(comment):
    replies = Comments.objects.all().filter(replying_to = comment.id)
    reply_comment_array = []
    for reply_comment in replies:
            reply ={
                'id': reply_comment.id,
                'user': serialize_user(reply_comment.users),
                'body' : reply_comment.comment_body,
                'date' : reply_comment.date,
                'likes': reply_comment.likes_counter,
                'replies' : get_comment_replies(reply_comment)
            }
            reply_comment_array.append(reply)
    
    return reply_comment_array

    
def get_comments_for_post(request):
    post_id = request.GET.get('post_id', None)
    if (post_id == None):    
        return JsonResponse({'error': 'Please input ?post_id= to the end of the url'}, status=401)
    else:
        try:
            comments =  Comments.objects.all().filter(post = int(post_id), replying_to__isnull=True).order_by(f'-date')
            # if (comments.reviews == None):
            #     comments.reviews.id = 0
                
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
            return JsonResponse({'error': f'Unable to get messages, {e}'}, status=400)
     
    return JsonResponse({
            'Comments': comments_data
        }, json_dumps_params={'indent':5})
  