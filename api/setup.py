from setuptools import setup, find_packages

setup(
    name='xunitdash',
    version='1.0.0',
    description='xunitdash backend',
    url='https://github.com/',
    author='Sergio Torres Soldado',
    keywords='rest restful api flask swagger openapi flask-restplus',
    packages=find_packages(),

    install_requires=[
        'numpy',
        'requests',
        'tqdm',
        'lorem_text',
        'lxml',
        'flask',
        'safrs',
        'psycopg2',
    ],
)
