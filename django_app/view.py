from typing import Any
from django.shortcuts import render

def spa_index(request : Any):
    # this will look in your static/angular/index.html
    return render(request, "index.html")
