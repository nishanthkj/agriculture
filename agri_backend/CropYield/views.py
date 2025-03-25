import pandas as pd
from django.shortcuts import render
from django.conf import settings
import os
def index(request):
    csv_path = os.path.join(settings.BASE_DIR, 'CropYield', 'static', 'CropYield', 'Datasets', 'crop_data.csv')
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.lower()
    crops = sorted(df['crop'].dropna().unique())
    seasons = sorted(df['season'].dropna().unique())
    states = sorted(df['state'].dropna().unique())
    print(crops)
    print(seasons)
    print(states)
    return render(request, 'CropYield/index.html', {
        'crops': crops,
        'seasons': seasons,
        'states': states,
    })
# import os
# import pandas as pd
# from django.conf import settings
# from django.shortcuts import render

#def crop_yield_form(request):
    # csv_path = os.path.join(
    #     settings.BASE_DIR,
    #     'CropYield', 'static', 'CropYield', 'Datasets', 'crop_data.csv'
    # )

    # try:
    #     df = pd.read_csv(csv_path)
    #     df.columns = df.columns.str.strip().str.lower()  # Normalize headers

    #     crops = sorted(df['crop'].dropna().unique())
    #     seasons = sorted(df['season'].dropna().unique())
    #     states = sorted(df['state'].dropna().unique())
    # except Exception as e:
    #     return render(request, 'CropYield/index.html', {
    #         'error': f"⚠️ CSV error: {e}",
    #         'crops': [],
    #         'seasons': [],
    #         'states': [],
    #     })

    # return render(request, 'CropYield/index.html', {
    #     'crops': crops,
    #     'seasons': seasons,
    #     'states': states,
    # })
